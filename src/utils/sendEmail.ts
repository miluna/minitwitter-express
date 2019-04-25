import { SendMailOptions } from "nodemailer";
import { emailConfig } from "../config/config";

export default function sendEmail(email: string, body: string, subject = "Your password has been reset in Minitwitter!"): Promise<any> {
    const emailOptions: SendMailOptions = {
        from: process.env.SERVICE_EMAIL || 'youremail@gmail.com',
        to: email,
        subject,
        html: body,
    };

    return emailConfig.sendMail(emailOptions);
}
