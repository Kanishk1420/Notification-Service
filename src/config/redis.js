const { ConnectionOptions } = require('bullmq');
const logger = require('../utils/logger');

// Redis connection configuration for BullMQ
exports.redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};

// Test Redis connection
exports.testRedisConnection = async () => {
  try {
    const { createClient } = require('redis');
    const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });
    
    await client.connect();
    logger.info('Redis connected successfully');
    await client.quit();
    return true;
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`);
    return false;
  }
};
