// Redis configuration placeholder
const redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = require('./env');

const client = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

// await client.connect(); // Connect when needed

module.exports = client;
