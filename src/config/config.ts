import { ConnectionConfig, Pool } from 'mysql';
import mysql from 'promise-mysql';

const dbConfig: ConnectionConfig = {
    host: 'localhost',
    port: 3360,
    user: 'root',
    password: 'root',
    database: 'twitter'
};
export const db = mysql.createPool(dbConfig);
export const secretOrKey: string = "secret";
