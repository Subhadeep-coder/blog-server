import dotenv from 'dotenv';
dotenv.config();

export const RedisConnectionConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
};