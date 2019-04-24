import { db } from '../config/config';
import { CrudService } from './CrudService';
import { Post } from '../models/Post';
import { UserComment } from 'src/models/Comment';
import { User } from 'src/models/User';


export class PostService implements CrudService<Post> {
    
    async findById(id: string): Promise<Post> {
        try {
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

            const rows = await db.query(query, values)
            if (rows && rows.length > 0) {
                const post: Post = rows[0];
                const comments: UserComment[] = await this.findComments(id);
                const likes: User[] = await this.findLikes(id);
                post.comments = comments;
                post.likes = likes;
                return post;
            } else throw ({error: "Not found"})
        } catch(err) {
                console.log(err);
                throw ({ error: err });
        }
    }    
    
    findAll(): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM posts";

            db.query(query)
                .then(rows => {
                    resolve(rows);
                })
                .catch(err => {
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    async createOne(newPost: Post): Promise<Post> {
        try {
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
            const insertedComment = await this.findById(insert.insertId);
            return insertedComment;
        } catch (err) {
            console.log(err.message);
            throw { error: err.message };
        }
    }

    updateOne(id: string, updatedPost: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    deleteOne(id: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM posts WHERE id=?";
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

    likeOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    dislikeOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    retweetOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
            // TODO
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    unretweetOne(postId: string, userId: string): Promise<Post> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        });
    }

    findUserPosts(userId: string): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
            id, 
            user_id as userId, 
            content, 
            post_timestamp AS timestamp, 
            picture
            FROM posts 
            WHERE user_id=?
            `;
            const values = [userId];

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

    findComments(postId: string): Promise<UserComment[]> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        })
    }

    findLikes(postId: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
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
                    console.log(err);
                    reject({ error: err });
                })
        })
    }
}
