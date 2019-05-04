import { db } from '../config/config';
import { UserComment } from '../models/Comment';
import {MultipleCrudService} from "./MultipleCrudService";
import {logError} from "../config/logging";


export class CommentService implements MultipleCrudService<UserComment> {

    findById(id: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM comments WHERE id=?";
            const values = [id];

            db.query(query, values)
                .then(rows => {
                    resolve(rows);
                })
                .catch(err => {
                    logError("CommentService/findById", err);
                    reject({ error: err });
                })
        });
    }

    findAll(offset = 0): Promise<UserComment[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM comments LIMIT ?,25";
            const values = [offset];
            db.query(query, values)
                .then(rows => {
                    resolve(rows);
                })
                .catch(err => {
                    logError("CommentService/findAll", err);
                    reject({ error: err });
                })
        });
    }

    async createOne(newComment: UserComment): Promise<UserComment> {
        try {
            const query = `
            INSERT INTO 
            comments(content, post_id, user_id) 
            VALUES(?, ?, ?)
            `;
            const values = [
                newComment.content,
                newComment.postId,
                newComment.userId
            ];

            const insert = await db.query(query, values);
            const insertedComment = await this.findById(insert.insertId);
            return insertedComment;
        } catch (err) {
            logError("CommentService/createOne", err.message);
            throw { error: err.message };
        }
    }

    updateOne(id: string, updatedInfo: UserComment): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const sel = `
            UPDATE comments 
            SET content=COALESCE(?,content) 
            WHERE id=?`;

            const values = [
                updatedInfo.content, 
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
                    logError("CommentService/updateOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    deleteOne(id: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM comments WHERE id=?";
            const values = [id];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({id: id}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("CommentService/deleteOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    likeOne(commentId: string, userId: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO 
            comments_have_likes(comment_id, user_id) 
            VALUES(?, ?)
            `;
            const values = [commentId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({ id: rows.insertId });
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("CommentService/likeOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    dislikeOne(commentId: string, userId: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM comments_have_likes 
            WHERE comment_id=? AND user_id=?
            `;
            const values = [commentId, userId];

            db.query(query, values)
                .then(rows => {
                    if (rows && rows.affectedRows > 0) {
                        resolve({id: commentId}) 
                    } else reject({error: "Not found"})
                })
                .catch(err => {
                    logError("CommentService/dislikeOne", err.message);
                    reject({ error: err.message });
                })
        });
    }

    findUserObjects(userId: string, offset = 0): Promise<UserComment[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM comments WHERE user_id=? LIMIT ?,25";
            const values = [userId, offset];

            db.query(query, values)
                .then(rows => {
                    resolve(rows);
                })
                .catch(err => {
                    logError("CommentService/findUserObjects", err.message);
                    reject({ error: err.message });
                })
        });
    }
}
