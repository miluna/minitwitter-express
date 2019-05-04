import express, { Router, Request, Response, NextFunction } from 'express';
import { PostService } from '../services/PostService';
import passport from 'passport';
import { Post } from 'src/models/Post';
import {assureSamePostOwner} from "../utils/assureSameUser";

export const service: PostService = new PostService();
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const { offset } = req.query;
    service.findAll(offset)
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json(err));
});

router.post("/", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const post: Post = req.body;
    const { user } = req;
    post.userId = user.id;
    service.createOne(post)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/:id([0-9]*)", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.put("/:id([0-9]*)", passport.authenticate("jwt", {session: false}), assureSamePostOwner, (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedpost: Post = req.body;
    service.updateOne(id, updatedpost)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id([0-9]*)", passport.authenticate("jwt", {session: false}), assureSamePostOwner, (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/:id([0-9]*)/like", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.likeOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id([0-9]*)/like", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.dislikeOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/:id([0-9]*)/retweet", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.retweetOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id([0-9]*)/retweet", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.unretweetOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/currentuser", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { offset } = req.query;
    service.findUserObjects(user.id, offset)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

export default router;
