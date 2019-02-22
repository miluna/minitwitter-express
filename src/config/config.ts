import mysql, { Connection, ConnectionConfig } from 'mysql';

const dbConfig: ConnectionConfig = {
    host: 'localhost',
    user: 'root',
    password: 'YOURPASSWORD',
    database: 'YOURDATABASE'
};
export const db : Connection = mysql.createConnection(dbConfig);
export const secretOrKey: string = "secret";


