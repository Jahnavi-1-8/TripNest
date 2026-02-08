const redis = require('redis');
const { Redis } = require('@upstash/redis');

let redisClient;

// Check for Upstash HTTP credentials first (most robust for serverless/cloud)
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log('Using Upstash HTTP Redis...');
    const upstash = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Wrapper to match standard redis client API partially
    redisClient = {
        isOpen: true, // HTTP is stateless, always "open"
        get: async (key) => await upstash.get(key),
        set: async (key, value, options) => {
            // Map standard options { EX: 10 } to Upstash options { ex: 10 }
            const upstashOptions = {};
            if (options && options.EX) upstashOptions.ex = options.EX;
            return await upstash.set(key, value, upstashOptions);
        },
        del: async (key) => await upstash.del(key),
        // Add other methods as needed
    };

}
// Fallback to standard Redis (TCP) if REDIS_URL is present
else if (process.env.REDIS_URL) {
    console.log('Using Standard Redis (TCP)...');
    const client = redis.createClient({
        url: process.env.REDIS_URL,
        socket: {
            tls: process.env.REDIS_URL.startsWith('rediss://'),
            rejectUnauthorized: false,
            reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
        }
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    (async () => {
        try {
            await client.connect();
            console.log('✅ Connected to Standard Redis');
        } catch (err) {
            console.error('Failed to connect to Standard Redis:', err.message);
        }
    })();

    redisClient = client;
} else {
    console.warn('⚠️ No Redis credentials found. Caching disabled.');
    redisClient = null;
}

module.exports = redisClient;
