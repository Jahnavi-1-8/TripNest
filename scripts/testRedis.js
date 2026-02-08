require('dotenv').config();
const redisClient = require('../utils/redis');

(async () => {
    console.log('Testing Redis Connection...');
    try {
        if (!redisClient) {
            console.error('Redis client is null (credentials missing/invalid).');
            process.exit(1);
        }

        // Wait a bit for connection if it's the TCP client, though HTTP is instant
        // But utils/redis.js initiates connection for TCP.
        // For HTTP, it's just an object.

        const testKey = 'test:connection';
        const testVal = 'success-' + Date.now();

        console.log(`Setting key ${testKey}...`);
        await redisClient.set(testKey, testVal, { EX: 60 });
        console.log('Set command successful.');

        console.log(`Getting key ${testKey}...`);
        const result = await redisClient.get(testKey);
        console.log(`Get result: ${result}`);

        if (result === testVal) {
            console.log('✅ Redis is working correctly!');
            process.exit(0);
        } else {
            console.error('❌ Redis value mismatch.');
            process.exit(1);
        }

    } catch (err) {
        console.error('❌ Redis Test Failed:', err);
        process.exit(1);
    }
})();
