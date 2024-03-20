import { Worker } from "bullmq";
import { RedisConnectionConfig } from "../config/redis";
import { sendMail } from "../utils/sendMail";

// For execute the queue
export const emailWorker = new Worker('email-queue', async (job) => {
    const data = job.data;
    console.log('Job Data:', data);
    // await sendMail({
    //     to: data.to,
    //     subject: data.subject,
    //     html: data.html,
    // });
    console.log('Job Done');
}, {
    connection: RedisConnectionConfig,
    limiter: {
        max: 20,
        duration: 10 * 1000
    },
    autorun: false,
});