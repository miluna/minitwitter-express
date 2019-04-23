import { ConnectionConfig, Pool } from 'mysql';
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
