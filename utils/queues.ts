import { Queue } from "bullmq";
import dotenv from 'dotenv';
import IORedis from 'ioredis';
// import { RedisConnectionConfig } from "../config/redis";
dotenv.config();

const connection = new IORedis(process.env.SERVICE_URI!, { maxRetriesPerRequest: null });

// For enqueue
export const emailQueue = new Queue("email-queue", {
    connection: connection,
});