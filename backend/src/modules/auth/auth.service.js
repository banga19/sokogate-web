const argon2 = require('@node-rs/argon2');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../common/database/models');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../../common/utils/jwt');
const { AuthError, ConflictError } = require('../../common/utils/errors');
const redis = require('../../config/redis');
const config = require('../../config');

const ARGON2_OPTIONS = {
  memoryCost: 64 * 1024,
  timeCost: 3,
  parallelism: 1,
};

const LOGIN_LOCKOUT_THRESHOLD = 5;
const LOGIN_LOCKOUT_DURATION_SECONDS = 900;

const SCAN_COUNT = 100; // Keys per SCAN iteration

/**
 * Scan Redis keys matching a pattern using cursor-based SCAN instead of blocking KEYS.
 *
 * redis.keys() blocks the Redis event loop until complete — a problem when a user
 * has thousands of active sessions. SCAN iterates incrementally, yielding the event
 * loop between batches so other operations aren't starved.
 *
 * ioredis handles keyPrefix transparently: the MATCH pattern and returned keys
 * both operate within the prefixed namespace without needing to include the prefix.
 *
 * @param {string} pattern - Key pattern (e.g. "refresh:user-id:*")
 * @param {number} [count=SCAN_COUNT] - Batch size per SCAN iteration
 * @returns {Promise<string[]>} Array of matching keys
 */
async function scanKeys(pattern, count = SCAN_COUNT) {
  const keys = [];
  let cursor = '0';
  do {
    const [nextCursor, batch] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    cursor = nextCursor;
    keys.push(...batch);
  } while (cursor !== '0');
  return keys;
}

async function hashPassword(password) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    const { default: bcrypt } = require('bcryptjs');
    try {
      const match = await bcrypt.compare(password, hash);
      if (match) {
        const newHash = await hashPassword(password);
        await User.update({ password_hash: newHash }, { where: { password_hash: hash } });
      }
      return match;
    } catch {
      return false;
    }
  }
}

async function checkAccountLockout(identifier) {
  const key = `login:attempts:${identifier}`;
  const stored = await redis.get(key);
  if (!stored) return false;

  const data = JSON.parse(stored);
  if (data.locked_until && new Date(data.locked_until) > new Date()) {
    return true;
  }
  return false;
}

async function recordFailedLogin(identifier) {
  const key = `login:attempts:${identifier}`;
  const stored = await redis.get(key);
  const data = stored ? JSON.parse(stored) : { attempts: 0, locked_until: null };

  data.attempts += 1;
  if (data.attempts >= LOGIN_LOCKOUT_THRESHOLD) {
    data.locked_until = new Date(Date.now() + LOGIN_LOCKOUT_DURATION_SECONDS * 1000).toISOString();
  }

  await redis.set(key, JSON.stringify(data), 'EX', LOGIN_LOCKOUT_DURATION_SECONDS);
  return data;
}

async function clearLoginAttempts(identifier) {
  await redis.del(`login:attempts:${identifier}`);
}

async function mintTokens(user) {
  // JWT payload — keep minimal! Only 'sub' (user ID) and 'role' for authorization.
  // NEVER include PII (email, name, phone) in the token — JWT is signed but NOT encrypted,
  // so the payload is base64-decoded by anyone who inspects it.
  const payload = {
    sub: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await redis.set(
    `refresh:${user.id}:${uuidv4()}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 900,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      google_linked: !!user.google_id,
      avatar_url: user.avatar_url,
    },
  };
}

async function login({ email, password }) {
  const locked = await checkAccountLockout(email);
  if (locked) {
    throw new AuthError('Account locked due to too many failed attempts. Please try again later or reset your password.', 42300, 423);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    await recordFailedLogin(email);
    throw new AuthError('Invalid email or password');
  }

  const passwordHash = user.password_hash;
  if (!passwordHash) {
    await recordFailedLogin(email);
    throw new AuthError('Invalid email or password');
  }

  const isMatch = await verifyPassword(passwordHash, password);
  if (!isMatch) {
    await recordFailedLogin(email);
    throw new AuthError('Invalid email or password');
  }

  await clearLoginAttempts(email);

  return mintTokens(user);
}

async function register({ email, password, name, phone, country_code }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const password_hash = await hashPassword(password);

  const user = await User.create({
    email,
    password_hash,
    name: name || email.split('@')[0],
    phone,
    country_code,
    role: 'buyer',
  });

  return mintTokens(user);
}

async function refresh(refreshToken) {
  try {
    const decoded = verifyToken(refreshToken);

    const keys = await scanKeys(`refresh:${decoded.sub}:*`);
    const storedTokens = await Promise.all(keys.map(async (k) => redis.get(k)));
    const match = storedTokens.includes(refreshToken);

    if (!match || !storedTokens.length) {
      if (keys.length) {
        await Promise.all(keys.map(k => redis.del(k)));
      }
      throw new AuthError('Refresh token revoked or unknown', 40302, 403);
    }

    await Promise.all(keys.map(k => redis.del(k)));

    const user = await User.findByPk(decoded.sub);
    if (!user) {
      throw new AuthError('User not found', 40400, 404);
    }

    return mintTokens(user);
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError('Invalid or expired refresh token', 40302, 403);
  }
}

async function googleLogin({ idToken }) {
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new AuthError('Invalid Google credentials', 40101, 401);
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;

  let user = await User.findOne({ where: { email } });

  if (user) {
    if (user.password_hash) {
      throw new AuthError('An account with this email already exists. Please sign in with your password, or contact support to link your Google account.', 40900, 409);
    }
    if (!user.google_id) {
      user.google_id = googleId;
      user.save();
    }
  } else {
    user = await User.create({
      email,
      name: payload.name,
      google_id: googleId,
      password_hash: null,
      role: 'buyer',
      is_verified: payload.email_verified || false,
    });
  }

  return mintTokens(user);
}

async function logout(userId, refreshToken) {
  if (refreshToken) {
    try {
      const decoded = verifyToken(refreshToken);
      const keys = await scanKeys(`refresh:${decoded.sub}:*`);
      const storedTokens = await Promise.all(keys.map(async (k) => redis.get(k)));
      if (storedTokens.includes(refreshToken)) {
        await Promise.all(keys.map(k => redis.del(k)));
      }
    } catch {
      // best-effort revocation
    }
  } else {
    const keys = await scanKeys(`refresh:${userId}:*`);
    await Promise.all(keys.map(k => redis.del(k)));
  }
}

async function sendResetEmail(toEmail, resetToken) {
  const { default: sgMail } = require('@sendgrid/mail');
  const appUrl = process.env.APP_URL || 'https://sokogate.com';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  sgMail.setApiKey(config.sendgrid.apiKey);

  await sgMail.send({
    to: toEmail,
    from: config.sendgrid.fromEmail,
    subject: 'Password Reset Request — Sokogate',
    html: `
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
    `,
  });
}

async function forgotPassword({ email }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { message: 'If the email exists, a reset link has been sent' };
  }

  const resetToken = uuidv4();
  await redis.set(
    `reset:${email}`,
    resetToken,
    'EX',
    60 * 60
  );

  if (config.sendgrid.apiKey) {
    try {
      await sendResetEmail(email, resetToken);
    } catch (err) {
      console.error('Failed to send reset email:', err.message);
    }
  }

  return { message: 'If the email exists, a reset link has been sent' };
}

async function resetPassword({ email, token, newPassword }) {
  const stored = await redis.get(`reset:${email}`);
  if (!stored || stored !== token) {
    throw new AuthError('Invalid or expired reset token', 40001, 400);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AuthError('User not found', 40400, 404);
  }

  const password_hash = await hashPassword(newPassword);
  await user.update({ password_hash });

  await redis.del(`reset:${email}`);

  await clearLoginAttempts(email);

  return { message: 'Password reset successfully' };
}

module.exports = {
  login,
  register,
  refresh,
  forgotPassword,
  resetPassword,
  logout,
  googleLogin,
  checkAccountLockout,
  recordFailedLogin,
  clearLoginAttempts,
  hashPassword,
  verifyPassword,
};
