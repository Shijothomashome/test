// import Queue from 'bull';
// import redis from 'redis';
// import config from './config.js';

// class QueueManager {
//   constructor() {
//     this.queues = new Map();
//     this.redisConfig = {
//       redis: {
//         host: config.REDIS_HOST || 'localhost',
//         port: config.REDIS_PORT || 6379,
//         password: config.REDIS_PASSWORD || undefined,
//         retryStrategy: (times) => {
//           const delay = Math.min(times * 50, 2000);
//           return delay;
//         }
//       }
//     };
//   }

//   createQueue(name, options = {}) {
//     if (this.queues.has(name)) {
//       return this.queues.get(name);
//     }

//     const queue = new Queue(name, {
//       ...this.redisConfig,
//       defaultJobOptions: {
//         removeOnComplete: true,
//         removeOnFail: false,
//         attempts: 3,
//         backoff: {
//           type: 'exponential',
//           delay: 1000
//         },
//         ...options
//       }
//     });

//     // Event listeners
//     queue.on('error', (error) => {
//       console.error(`Queue ${name} error:`, error);
//     });

//     queue.on('waiting', (jobId) => {
//       console.log(`Job ${jobId} in queue ${name} is waiting`);
//     });

//     queue.on('active', (job) => {
//       console.log(`Job ${job.id} in queue ${name} started`);
//     });

//     queue.on('completed', (job) => {
//       console.log(`Job ${job.id} in queue ${name} completed`);
//     });

//     queue.on('failed', (job, error) => {
//       console.error(`Job ${job.id} in queue ${name} failed:`, error);
//     });

//     queue.on('stalled', (job) => {
//       console.warn(`Job ${job.id} in queue ${name} stalled`);
//     });

//     queue.on('paused', () => {
//       console.log(`Queue ${name} paused`);
//     });

//     queue.on('resumed', () => {
//       console.log(`Queue ${name} resumed`);
//     });

//     queue.on('cleaned', (jobs, type) => {
//       console.log(`Cleaned ${jobs.length} ${type} jobs from queue ${name}`);
//     });

//     this.queues.set(name, queue);
//     return queue;
//   }

//   getQueue(name) {
//     return this.queues.get(name);
//   }

//   async closeAll() {
//     const closePromises = [];
//     for (const [name, queue] of this.queues) {
//       closePromises.push(queue.close());
//       console.log(`Closing queue ${name}`);
//     }
//     await Promise.all(closePromises);
//     this.queues.clear();
//   }

//   async cleanAll() {
//     for (const [name, queue] of this.queues) {
//       await queue.clean(0, 'failed');
//       await queue.clean(0, 'completed');
//       console.log(`Cleaned queue ${name}`);
//     }
//   }

//   async getQueueStats() {
//     const stats = {};
//     for (const [name, queue] of this.queues) {
//       const counts = await queue.getJobCounts();
//       stats[name] = {
//         waiting: counts.waiting,
//         active: counts.active,
//         completed: counts.completed,
//         failed: counts.failed,
//         delayed: counts.delayed
//       };
//     }
//     return stats;
//   }
// }

// // Create singleton instance
// const queueManager = new QueueManager();

// // Create default queue
// const defaultQueue = queueManager.createQueue('default');

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await queueManager.closeAll();
//   process.exit();
// });

// export { queueManager, defaultQueue as queue };



class MemoryQueue {
  constructor() {
    this.queues = new Map();
    this.processing = new Map();
    console.log('Using in-memory queue');
  }

  createQueue(name) {
    if (!this.queues.has(name)) {
      this.queues.set(name, []);
      this.processing.set(name, new Set());
    }
    return {
      add: async (data, options = {}) => {
        const job = {
          id: `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          data,
          attempts: options.attempts || 3,
          backoff: options.backoff || { type: 'exponential', delay: 1000 }
        };
        this.queues.get(name).push(job);
        return job;
      },
      process: (concurrency, handler) => {
        setInterval(async () => {
          const queue = this.queues.get(name);
          const processing = this.processing.get(name);
          
          if (queue.length > 0 && processing.size < concurrency) {
            const job = queue.shift();
            processing.add(job.id);
            
            try {
              await handler(job);
              processing.delete(job.id);
            } catch (error) {
              processing.delete(job.id);
              if (job.attempts > 1) {
                job.attempts--;
                const delay = job.backoff.type === 'exponential' 
                  ? job.backoff.delay * (4 - job.attempts)
                  : job.backoff.delay;
                setTimeout(() => queue.push(job), delay);
              }
            }
          }
        }, 100);
      }
    };
  }

  async closeAll() {
    this.queues.clear();
    this.processing.clear();
  }
}

const queueManager = new MemoryQueue();
const defaultQueue = queueManager.createQueue('default');

process.on('SIGINT', async () => {
  await queueManager.closeAll();
  process.exit();
});

export { queueManager, defaultQueue as queue };