import crypto from 'crypto';
import UserModel from '../models/user.model';

export const generateUsername = async (name: string, email: string) => {

    let users = await UserModel.find({}).select("username");
    let existingUsernames = users.map(user => user.username);
    let baseUsername = '';
    if (Math.random() < 0.5) {
        baseUsername = name.replace(/\s/g, '').toLowerCase() || email.split('@')[0].toLowerCase();
    } else {
        baseUsername = email.split('@')[0].toLowerCase() || name.replace(/\s/g, '').toLowerCase();
    }

    let username = baseUsername;
    let suffix;

    do {
        suffix = crypto.randomInt(100000); // Generate a random number between 0 and 999
        username = baseUsername + (suffix !== 0 ? suffix : '').toString(); // Append suffix if not zero
    } while (existingUsernames.includes(username));

    return username;
}