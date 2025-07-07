const config = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  QUEUE_CONCURRENCY: process.env.QUEUE_CONCURRENCY || 5,
  CACHE_TTL: process.env.CACHE_TTL || 3600, // 1 hour
  NODE_ENV: process.env.NODE_ENV || 'development'
};

export default config;