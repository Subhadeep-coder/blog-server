import path from "path";
import { transporter } from "../config/mail";
import dotenv from 'dotenv';
import ejs from 'ejs';
dotenv.config();

interface MailType {
    to: string;
    subject: string;
    template: string;
    data: any;
}

export const sendMail = async ({
    to,
    subject,
    template,
    data,
}: MailType) => {
    try {
        const templatePath = path.join(__dirname, "../mails", template);
        const html: string = await ejs.renderFile(templatePath, data);
        const info = await transporter.sendMail({
            from: process.env.SMTP_MAIL, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        });

        console.log('MessageId: ', info.messageId);
    } catch (error) {
        console.log(error);
    }

}