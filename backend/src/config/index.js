const dotenv = require('dotenv');
const path = require('path');

// Load .env file from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  db: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'sokogate',
    username: process.env.DB_USER || 'sokogate',
    password: process.env.DB_PASSWORD || 'changeme',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 20,
      min: 5,
      idle: 30000,
      acquire: 60000,
    },
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    keyPrefix: 'sokogate:',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4500',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },

  payment: {
    flutterwave: {
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
    },
    paystack: {
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
    },
  },

  oss: {
    region: process.env.OSS_REGION || 'oss-cn-hongkong',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
    bucket: process.env.OSS_BUCKET || 'sokogate-com',
    endpoint: process.env.OSS_ENDPOINT || 'https://oss-sokogate-com.oss-cn-hongkong.aliyuncs.com',
  },

  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
  },

  nvidia: {
    apiKey: process.env.NVIDIA_API_KEY || '',
    model: process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct',
  },

  apify: {
    apiKey: process.env.APIFY_API_KEY || '',
    facebookActorId: process.env.APIFY_FACEBOOK_ACTOR || 'apify/facebook-posts-scraper',
    linkedInActorId: process.env.APIFY_LINKEDIN_ACTOR || 'curiosum/linkedin-post-scraper',
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'agent@sokogate.com',
  },

  commentAgent: {
    dailyLimit: parseInt(process.env.COMMENT_AGENT_DAILY_LIMIT, 10) || 25,
    minDelaySeconds: parseInt(process.env.COMMENT_AGENT_MIN_DELAY, 10) || 180,
    maxDelaySeconds: parseInt(process.env.COMMENT_AGENT_MAX_DELAY, 10) || 480,
  },

  easemob: {
    appkey: process.env.EASEMOB_APPKEY || '1101220606096669#demo',
    clientId: process.env.EASEMOB_CLIENT_ID || '',
    clientSecret: process.env.EASEMOB_CLIENT_SECRET || '',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

module.exports = config;
