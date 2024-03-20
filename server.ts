import { app } from './app';
import dotenv from 'dotenv';
// import { emailWorker } from './queues/emailQueue';
import connectToDB from './database/db';
dotenv.config();
// emailWorker.run();
const port = process.env.SERVER_PORT || 8000;
app.listen(port, () => {
    console.log(`Server is up and running on port:${port}`);
    connectToDB();
});