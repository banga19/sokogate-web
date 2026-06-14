const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../common/database/models');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../../common/utils/jwt');
const { AuthError, ConflictError } = require('../../common/utils/errors');
const redis = require('../../config/redis');

const SALT_ROUNDS = 12;

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AuthError('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AuthError('Invalid email or password');
  }

  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token in Redis
  await redis.set(
    `refresh:${user.id}:${uuidv4()}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60 // 7 days
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes in seconds
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar_url: user.avatar_url,
    },
  };
}

async function register({ email, password, name, phone, country_code }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password_hash,
    name: name || email.split('@')[0],
    phone,
    country_code,
    role: 'buyer',
  });

  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: 900,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

async function refresh(refreshToken) {
  try {
    const decoded = verifyToken(refreshToken);
    const payload = {
      sub: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    };
  } catch (err) {
    throw new AuthError('Invalid or expired refresh token');
  }
}

async function forgotPassword({ email }) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Don't reveal whether the email exists
    return { message: 'If the email exists, a reset link has been sent' };
  }

  // Generate reset token
  const resetToken = uuidv4();
  await redis.set(
    `reset:${email}`,
    resetToken,
    'EX',
    60 * 60 // 1 hour
  );

  // In production, send email with reset link here
  // await sendResetEmail(email, resetToken);

  return { message: 'If the email exists, a reset link has been sent' };
}

module.exports = {
  login,
  register,
  refresh,
  forgotPassword,
};
