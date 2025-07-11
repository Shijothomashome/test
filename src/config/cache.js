// import redis from 'redis';
// import { promisify } from 'util';
// import config from './config.js';

// class Cache {
//   constructor() {
//     this.client = redis.createClient({
//       host: config.REDIS_HOST || 'localhost',
//       port: config.REDIS_PORT || 6379,
//       password: config.REDIS_PASSWORD || undefined,
//       enable_offline_queue: false,
//       retry_strategy: (options) => {
//         if (options.error && options.error.code === 'ECONNREFUSED') {
//           return new Error('The server refused the connection');
//         }
//         if (options.total_retry_time > 1000 * 60 * 60) {
//           return new Error('Retry time exhausted');
//         }
//         if (options.attempt > 10) {
//           return undefined;
//         }
//         return Math.min(options.attempt * 100, 5000);
//       }
//     });

//     // Promisify Redis methods
//     this.getAsync = promisify(this.client.get).bind(this.client);
//     this.setAsync = promisify(this.client.set).bind(this.client);
//     this.delAsync = promisify(this.client.del).bind(this.client);
//     this.flushAsync = promisify(this.client.flushdb).bind(this.client);
//     this.quitAsync = promisify(this.client.quit).bind(this.client);

//     // Error handling
//     this.client.on('error', (error) => {
//       console.error('Redis error:', error);
//     });

//     this.client.on('connect', () => {
//       console.log('Connected to Redis');
//     });

//     this.client.on('ready', () => {
//       console.log('Redis client ready');
//     });

//     this.client.on('reconnecting', () => {
//       console.log('Redis client reconnecting...');
//     });

//     this.client.on('end', () => {
//       console.log('Redis connection closed');
//     });
//   }

//   async get(key) {
//     try {
//       return await this.getAsync(key);
//     } catch (error) {
//       console.error('Cache get error:', error);
//       return null;
//     }
//   }

//   async set(key, value, ttl = 3600) {
//     try {
//       if (ttl) {
//         return await this.setAsync(key, JSON.stringify(value), 'EX', ttl);
//       }
//       return await this.setAsync(key, JSON.stringify(value));
//     } catch (error) {
//       console.error('Cache set error:', error);
//       return false;
//     }
//   }

//   async del(key) {
//     try {
//       return await this.delAsync(key);
//     } catch (error) {
//       console.error('Cache del error:', error);
//       return false;
//     }
//   }

//   async flush() {
//     try {
//       return await this.flushAsync();
//     } catch (error) {
//       console.error('Cache flush error:', error);
//       return false;
//     }
//   }

//   async quit() {
//     try {
//       return await this.quitAsync();
//     } catch (error) {
//       console.error('Cache quit error:', error);
//       return false;
//     }
//   }

//   async healthCheck() {
//     try {
//       await this.setAsync('healthcheck', 'ok', 'EX', 10);
//       const value = await this.getAsync('healthcheck');
//       return value === 'ok';
//     } catch (error) {
//       return false;
//     }
//   }
// }

// // Create singleton instance
// const cache = new Cache();

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await cache.quit();
//   process.exit();
// });

// export default cache;



class MemoryCache {
  constructor() {
    this.store = new Map();
    this.timeouts = new Map();
    console.log('Using in-memory cache');
  }

  async get(key) {
    const value = this.store.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttl = 3600) {
    this.store.set(key, JSON.stringify(value));
    
    // Clear existing timeout if any
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
    
    // Set new timeout if TTL provided
    if (ttl) {
      const timeout = setTimeout(() => {
        this.store.delete(key);
        this.timeouts.delete(key);
      }, ttl * 1000);
      this.timeouts.set(key, timeout);
    }
    
    return true;
  }

  async del(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
    return this.store.delete(key);
  }

  async flush() {
    this.store.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    return true;
  }

  async quit() {
    await this.flush();
    return true;
  }

  async healthCheck() {
    await this.set('healthcheck', 'ok', 10);
    const value = await this.get('healthcheck');
    return value === 'ok';
  }
}

const cache = new MemoryCache();

process.on('SIGINT', async () => {
  await cache.quit();
  process.exit();
});

export default cache;