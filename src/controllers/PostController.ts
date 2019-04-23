import express, { Router, Request, Response, NextFunction } from 'express';
import { PostService } from '../services/PostService';
import passport from 'passport';

const service: PostService = new PostService();
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    service.findAll()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json(err));
});

router.post("/", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const post = req.body;
    service.createOne(post)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.put("/:id", passport.authenticate("jwt", {session: false}) , (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedpost = req.body;
    service.updateOne(id, updatedpost)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(post => res.status(200).json(post))
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

router.get("/:id/retweet", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.retweetOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id/retweet", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { user } = req;
    service.unretweetOne(id, user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

router.get("/currentuser", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    service.findUserPosts(user.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(404).json(err));
});

export default router;
