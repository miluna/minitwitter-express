import { SendMailOptions } from "nodemailer";
import { emailConfig } from "../config/config";

export default function sendEmail(email: string, body: string, subject: string): Promise<any> {
    const emailOptions: SendMailOptions = {
        from: process.env.SERVICE_EMAIL || 'youremail@gmail.com',
        to: email,
        subject,
        html: body,
    };

    return emailConfig.sendMail(emailOptions);
}
