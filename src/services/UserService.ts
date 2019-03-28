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
                        delete rows[0].password;
                        resolve(rows[0])
                    } else reject({ error: "Not found" })
                })
                .catch(err => {
                    console.log(err.message);
                })
        })
    }

    findAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users";

            db.query(query)
                .then(rows => {
                    rows.map(e => {
                        delete e.password;
                        return e;
                    });
                    resolve(rows);
                })
                .catch(err => {
                    console.log(err.message);
                })
        })
    }

    async createOne(user: User): Promise<User> {
        try {
            // copy user info
            const newUser: User = { ...user };
            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);

            // set new password and save the user
            newUser.password = hash;
            const insertQuery =
                "INSERT INTO " +
                "users(name, username, email, password, description, location, webpage, picture) " +
                "VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
            const insertValues = [
                newUser.name,
                newUser.username,
                newUser.email,
                newUser.password,
                newUser.description,
                newUser.location,
                newUser.webpage,
                newUser.picture
            ];
            const insert = await db.query(insertQuery, insertValues);
            const insertedUser = await this.findById(insert.insertId);
            return insertedUser;
        } catch (err) {
            console.log(err.message);
            return { error: "Email or username already exists" }
        }
    }

    updateOne(id: string, updatedInfo: User): Promise<User> {
        return new Promise((resolve, reject) => {
            
            const sel = `
            UPDATE users 
            SET name=COALESCE(?,name), 
            description=COALESCE(?,description), 
            location=COALESCE(?,location), 
            webpage=COALESCE(?,webpage), 
            picture=COALESCE(?,picture) 
            WHERE id=?`;
            
            const values = [
                updatedInfo.name, 
                updatedInfo.description, 
                updatedInfo.location, 
                updatedInfo.webpage, 
                updatedInfo.picture, 
                id
            ];

            db.query(sel, values)
            .then(rows => {
                if (rows && rows.affectedRows > 0) {
                    const updatedUser = this.findById(id);
                    resolve(updatedUser) 
                } else reject({error: "Not found"})
            })
            .catch(err => {
                console.log(err.message);
                reject({error: "Error updating"})
            })        
        });
    }

    deleteOne(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const sel = 'DELETE FROM users WHERE id=?'
            const values = [id];

            db.query(sel, values)
                .then(rows => {

                    if (rows && rows.affectedRows > 0) {
                    resolve({id: id}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    console.log(err.message);
                    reject({error: "Not found"})
                })
        });
    }

    async login(user: User): Promise<Authentication> {
        const query = "SELECT id, name, username, email, password, picture FROM users WHERE email=?";
        const values = [user.email];

        const rows = await db.query(query, values);
        const password = rows[0].password;
        const isMatch = await bcrypt.compare(user.password, password);
        if (isMatch) {
            // User Matched. Create JWT payload
            const payload = {
                id: rows[0].id,
                name: rows[0].name,
                username: rows[0].username,
                email: rows[0].email,
                picture: rows[0].picture
            };

            // Sign JWT
            const token = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
            return { Authorization: "Bearer " + token }
        } else throw ({ error: "Password mismatch" })
    }
}
