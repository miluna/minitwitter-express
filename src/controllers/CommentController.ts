import express, { Router, Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/CommentService';
import passport from 'passport';

const service: CommentService = new CommentService();
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.query;
    if (postId) {
        service.findAll()
            .then(comments => res.status(200).json(comments))
            .catch(err => res.status(404).json(err));
    }
    res.status(400).json({ error: "postId parameter is required" });
});

router.post("/", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const comment = req.body;
    if (comment) {
        service.createOne(comment)
            .then(comment => res.status(200).json(comment))
            .catch(err => res.status(404).json(err));
    }
    res.status(400);
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(comment => res.status(200).json(comment))
        .catch(err => res.status(404).json(err));
});

router.put("/:id", passport.authenticate("jwt", {session: false}) , (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedcomment = req.body;
    service.updateOne(id, updatedcomment)
        .then(comment => res.status(200).json(comment))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(comment => res.status(200).json(comment))
        .catch(err => res.status(404).json(err));
});

router.get("/:id/like", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.likeOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id/like", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.dislikeOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/currentuser", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    service.findUserComments(user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

export default router;
