import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl: string = process.env.MONGO_URL || '';

const connectToDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log(`Connected to mongoDB at port ${dbUrl}`);
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectToDB, 5000);
    }
}

export default connectToDB;