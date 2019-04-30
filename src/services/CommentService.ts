import { db } from '../config/config';
import { UserComment } from '../models/Comment';
import {MultipleCrudService} from "./MultipleCrudService";


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
                    console.log(err);
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
                    console.log(err);
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
            console.log(err.message);
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
                    console.log(err);
                    reject({ error: err });
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    likeOne(commentId: string, userId: string): Promise<UserComment> {
        return new Promise((resolve, reject) => {
            // TODO
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
                    console.log(err);
                    reject({ error: err });
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
                    console.log(err);
                    reject({ error: err });
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }
}
