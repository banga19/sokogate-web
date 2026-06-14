const { Upload } = require('../../common/database/models');
const config = require('../../config');
const crypto = require('crypto');

/**
 * Generate OSS upload policy token
 * In production, use aliyun-oss-sdk to generate signed URLs
 */
async function getOssPolicy() {
  const expiration = new Date(Date.now() + 3600 * 1000).toISOString();
  const dir = `uploads/${Date.now()}/`;

  // This is a simplified policy — in production, use proper OSS SDK
  return {
    accessid: config.oss.accessKeyId || 'placeholder',
    host: config.oss.endpoint,
    policy: Buffer.from(JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, 1048576000], // 1GB
        ['starts-with', '$key', dir],
      ],
    })).toString('base64'),
    signature: crypto.randomBytes(20).toString('hex'),
    expire: Math.floor(Date.now() / 1000) + 3600,
    dir,
  };
}

async function recordFile(userId, data) {
  return Upload.create({
    user_id: userId || null,
    file_name: data.file_name,
    file_url: data.file_url,
    file_type: data.file_type,
    file_size: data.file_size,
    md5: data.md5,
  });
}

module.exports = {
  getOssPolicy,
  recordFile,
};
