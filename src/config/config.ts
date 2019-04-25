import { ConnectionConfig } from 'mysql';
import { Transporter, createTransport } from "nodemailer";
import mysql from 'promise-mysql';

const dbConfig: ConnectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3360,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'twitter'
};
export const db = mysql.createPool(dbConfig);
export const secretOrKey: string = "secret";
export const emailConfig: Transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVICE_EMAIL || 'youremail@gmail.com',
        pass: process.env.SERVICE_EMAIL_PASSWORD || 'yourpassword',
    }
});
