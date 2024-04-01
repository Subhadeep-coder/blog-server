import { Worker } from "bullmq";
import { RedisConnectionConfig } from "../config/redis";
import { sendMail } from "../utils/sendMail";
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const connection = new IORedis(process.env.SERVER_REDIS_URL!, { maxRetriesPerRequest: null });

// For execute the queue
export const emailWorker = new Worker('email-queue', async (job) => {
    const data = job.data;
    console.log('Job Data:', data);
    await sendMail({
        to: data.to,
        subject: data.subject,
        template: data.template,
        data: data.data,
    });
    console.log('Job Done');
}, {
    connection: connection,
    limiter: {
        max: 20,
        duration: 10 * 1000
    },
    autorun: false,
});