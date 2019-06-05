import { ConnectionConfig } from 'mysql';
import { Transporter, createTransport } from "nodemailer";
import mysql from 'promise-mysql';
import dotenv from "dotenv";

dotenv.config();

const dbConfig: ConnectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
export const db = mysql.createPool(dbConfig);
export const secretOrKey: string = process.env.JWT_SECRET;
export const emailConfig: Transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_EMAIL_PASSWORD,
    }
});
