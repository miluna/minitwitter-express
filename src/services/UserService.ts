import { db } from '../config/config';
import { CrudService } from './CrudService';
import { User } from '../models/User';
import { Authentication } from '../models/Authentication';
import { secretOrKey } from "../config/config";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export class UserService implements CrudService<User> {

    findById(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE id=?";
            const values = [id];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.length > 0) {
                        resolve(rows[0])
                    } else reject({ error: "Not found" })
                });
        })
    }

    findAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users";

            db.query(query)
                .then(rows => {
                    resolve(rows);
                })
        })
    }

    async createOne(user: User): Promise<User> {
        const q = "SELECT email FROM users WHERE email=?";
        const values = [user.email];

        const email = await db.query(q, values);
        if (email.length > 0) {
            throw { error: "Email already exists" }
        } else {
            // copy user info
            const newUser: User = { ...user };
            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);

            // set new password and save the user
            newUser.password = hash;
            const insertQuery =
                "INSERT INTO " +
                "users(name, email, password, description, location, webpage, picture) " +
                "VALUES(?, ?, ?, ?, ?, ?, ?)";
            const insertValues = [
                newUser.name,
                newUser.email,
                newUser.password,
                newUser.description,
                newUser.location,
                newUser.webpage,
                newUser.picture
            ];
            await db.query(insertQuery, insertValues);
            const idQuery = "SELECT id FROM users WHERE id=LAST_INSERT_ID()";
            const result = await db.query(idQuery);
            const insertedUser = await this.findById(result[0].id);
            return insertedUser;
        }
    }

    updateOne(id: string, t: User): Promise<User> {
        return new Promise((resolve, reject) => resolve());
    }

    deleteOne(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => resolve());
    }

    async login(user: User): Promise<Authentication> {
        const query = "SELECT password FROM users WHERE email=?";
        const values = [user.email];

        const rows = await db.query(query, values);
        const password = rows[0].password;
        const isMatch = await bcrypt.compare(user.password, password);
        if (isMatch) {
            // User Matched. Create JWT payload
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture
            };

            // Sign JWT
            const token = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
            return { Authorization: "Bearer " + token }
        } else throw ({ error: "Password mismatch" })
    }
}
