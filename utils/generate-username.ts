import crypto from 'crypto';
import UserModel from '../models/user.model';

export const generateUsername = async (name: string) => {
    let username = name.toLowerCase().split(' ').join('_') + crypto.randomInt(100000);

    // Check if the generated username already exists in the database
    let user = await UserModel.findOne({ username });
    while (user) {
        username = name.toLowerCase().split(' ').join('_') + crypto.randomInt(100000);
        user = await UserModel.findOne({ username });
    }
    console.log(username);

    return username;
}