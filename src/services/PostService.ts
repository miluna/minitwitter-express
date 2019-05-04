import { db } from '../config/config';
import { Post } from '../models/Post';
import { UserComment } from 'src/models/Comment';
import { User } from 'src/models/User';
import { MultipleCrudService } from "./MultipleCrudService";
import {logError, logMessage} from "../config/logging";


export class PostService implements MultipleCrudService<Post> {
    
    async findById(id: string): Promise<Post> {
        try {
            logMessage("PostService/findById", id);
            const query = `
            SELECT 
            id, 
            owner_id as userId, 
            content, 
            post_timestamp as timestamp, 
            picture 
            FROM posts 
            WHERE id=?
            `;
            const values = [id];

            const rows = await db.query(query, values);
            if (rows && rows.length > 0) {
                const post: Post = rows[0];
                const comments: UserComment[] = await this.findComments(id);
                const likes: User[] = await this.findLikes(id);
                post.comments = comments;
                post.likes = likes;
                return post;
            } else throw new Error("Not found")
        } catch(err) {
            logError("PostService/findById", err.message);
            throw ({ error: err.message });
        }
    }    
    
    findAll(offset = 0): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/findAll", "Retrieving all...");
            const query = "SELECT * FROM posts LIMIT ?, 25";
            const values = [offset];
            db.query(query, values)
                .then(rows => {
                    resolve(rows);
                    logMessage("PostService/findAll", "Retrieved succesfully")
                })
                .catch(err => {
                    logError("PostService/findAll", err.message);
                    reject({ error: err.message });
                })
        });
    }

    async createOne(newPost: Post): Promise<Post> {
        try {
            logMessage("PostService/createOne", "Creating post...");
            const query = `
            INSERT INTO 
            posts(content, picture, owner_id) 
            VALUES(?, ?, ?)
            `;
            const values = [
                newPost.content,
                newPost.picture,
                newPost.userId
            ];

            const insert = await db.query(query, values);
            const q2 = 'INSERT INTO users_have_posts(post_id, user_id) VALUES(?, ?)';
            const val2 = [insert.insertId, newPost.userId];
            const insertToTweets = db.query(q2, val2);
            const insertedComment = await this.findById(insert.insertId);
            logMessage("PostService/createOne", `Post ${insert.insertId} created succesfully`);
            return insertedComment;
        } catch (err) {
            logError("PostService/createOne", err.message);
            throw { error: err.message };
        }
    }

    updateOne(id: string, updatedPost: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/updateOne", `postId: ${id}`);
            const sel = `
            UPDATE posts 
            SET content=COALESCE(?,content),
            picture=COALESCE(?, picture)  
            WHERE id=?`;

            const values = [
                updatedPost.content, 
                updatedPost.picture,
                id
            ];

            db.query(sel, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        this.findById(id)
                            .then(updatedComment => resolve(updatedComment))
                            .catch(err => reject({ error: err }));
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/updateOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    deleteOne(id: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/deleteOne", `postId: ${id}`);
            const query = "DELETE FROM posts WHERE id=?";
            const values = [id];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({id: id}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/deleteOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    likeOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/likeOne", `postId: ${postId}, userId: ${userId}`);
            const query = `
            INSERT INTO 
            posts_have_likes(post_id, user_id) 
            VALUES(?, ?)
            `;
            const values = [postId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({ id: rows.insertId });
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/likeOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    dislikeOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/dislikeOne", `postId: ${postId}, userId: ${userId}`);
            const query = `
            DELETE FROM posts_have_likes 
            WHERE post_id=? AND user_id=?
            `;
            const values = [postId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({id: postId}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/dislikeOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    retweetOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/retweetOne", `postId: ${postId}, userId: ${userId}`);
            const query = `
            INSERT INTO 
            users_have_posts(post_id, user_id) 
            VALUES(?, ?)
            `;
            const values = [postId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({ id: rows.insertId });
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/retweetOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    unretweetOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/unretweetOne", `postId: ${postId}, userId: ${userId}`);
            const query = `
            DELETE FROM users_have_posts 
            WHERE post_id=? AND user_id=?
            `;
            const values = [postId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({id: postId}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("PostService/unretweetOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    async findUserObjects(userId: string, offset = 0): Promise<Post[]> {
        try {
            logMessage("PostService/findUserObjects", `userId: ${userId}, offset: ${offset}`);
            const query = `
            SELECT 
            post_id as postId 
            FROM users_have_posts 
            WHERE user_id=? 
            LIMIT ?, 25
            `;
            const values = [userId, offset];

            const rows = await db.query(query, values);
            let result = [];
            if (rows && rows.length > 0) {
                result = rows.map(async e => this.findById(e.postId));
                return Promise.all(result);
            } else return result;
        } catch(err) {
            logError("PostService/findUserObjects", err.message);
            throw { error: err.message };
        }
    }

    findComments(postId: string): Promise<UserComment[]> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/findComments", `postId: ${postId}`);
            const sql = `
                SELECT id, content, user_id as userId 
                FROM comments 
                WHERE post_id=?
            `;
            const values = [postId];

            db.query(sql, values)
                .then(rows => {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    } else resolve([])
                })
                .catch(err => {
                    logError("PostService/findComments", err.message);
                    reject({ error: err.message });
                })
        })
    }

    findLikes(postId: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            logMessage("PostService/findlikes", `postId: ${postId}`);
            const sql = `
                SELECT id, user_id as userId 
                FROM posts_have_likes 
                WHERE post_id=?
            `;
            const values = [postId];

            db.query(sql, values)
                .then(rows => {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    } else resolve([])
                })
                .catch(err => {
                    logError("PostService/findLikes", err.message);
                    reject({ error: err.message });
                })
        })
    }
}
