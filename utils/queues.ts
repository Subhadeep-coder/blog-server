import { Queue } from "bullmq";
import dotenv from 'dotenv';
import { RedisConnectionConfig } from "../config/redis";
dotenv.config();

// For enqueue
export const emailQueue = new Queue("email-queue", {
    connection: RedisConnectionConfig,
});