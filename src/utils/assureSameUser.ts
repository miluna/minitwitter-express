import { Request, Response, NextFunction } from 'express';
import {Post} from "../models/Post";
import {UserComment} from "../models/Comment";

export const assureSameUser = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    if (user && id && parseInt(id) === parseInt(user.id)) {
        next();
    } else {
        res.send(401).json({ error: "User is not allowed" });
    }
};

export const assureSamePostOwner = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const updatedpost: Post = req.body;

    if (user && updatedpost && parseInt(updatedpost.userId) === parseInt(user.id)) {
        next();
    } else {
        res.status(401).json({ error: "User is not the owner of the post" });
    }
};

export const assureSameCommentOwner = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const updatedComment: UserComment = req.body;

    if (user && updatedComment && parseInt(updatedComment.userId) === parseInt(user.id)) {
        next();
    } else {
        res.status(401).json({ error: "User is not the owner of the comment" });
    }
};
