'use strict'
const redis = require('redis');

let client = {};

client.instaceClient = redis.createClient({
    username: 'default', 
    password: 'C4zOo9sQBP3BUhFhbKNJtu2ios8gXgIa', 
    socket: {
    host: 'redis-18253.c294.ap-northeast-1-2.ec2.redns.redis-cloud.com',
    port: 18253,
}
});

const setObjectInRedis = async (key, object) => {
    await client.instaceClient.set(key, JSON.stringify(object),{EX:10});
};

const getObjectFromRedis = async (key) => {
    const value = await client.instaceClient.get(key);
    return JSON.parse(value);
};

const connectRedis = async  () => {
    

    client.instaceClient.on('error', (err) => console.log('Redis Client Error', err));

    await client.instaceClient.connect();
    // const obj = { foo: 'bar', numbers: [1, 2, 3], nested: { a: 1, b: 2 } };
    // await setObjectInRedis('myObject', obj);
    
    // const value = await  getObjectFromRedis('myObject');
    // console.log(value);
    // await client.instaceClient.disconnect();

}

const getRedis =  () =>  client;

const closeRedis = async () => {
    
}

const workRedis = async (data) => {
    const obj = { data };
    await setObjectInRedis('data', obj);
    const value = await  getObjectFromRedis('data');
    console.log(value);
}

module.exports = {connectRedis, getRedis, closeRedis, workRedis};
