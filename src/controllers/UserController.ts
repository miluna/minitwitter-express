import express, { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import { assureSameUser } from '../utils/assureSameUser';
import passport from 'passport';
import {service as PostService} from "./PostController";
import {service as CommentService} from "./CommentController";

export const service: UserService = new UserService();
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const { offset } = req.query;
    service.findAll(offset)
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json(err));
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    service.createOne(user)
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json(err));
});

router.get("/:id([0-9]*)", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
});

router.put("/:id([0-9]*)", passport.authenticate("jwt", {session: false}), assureSameUser, (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedUser: User = req.body;
    service.updateOne(id, updatedUser)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
});

router.delete("/:id([0-9]*)", passport.authenticate("jwt", {session: false}), assureSameUser, (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    service.login(user)
        .then(auth => res.status(200).json(auth))
        .catch(err => res.status(400).json(err));
});

router.get("/:id([0-9]*)/reset-password", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.resetPassword(id)
        .then(auth => res.status(200).json(auth))
        .catch(err => res.status(400).json(err));
});

router.post("/:id([0-9]*)/change-password", passport.authenticate("jwt", {session: false}), assureSameUser, (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    service.changePassword(user)
        .then(auth => res.status(200).json(auth))
        .catch(err => res.status(400).json(err));
});

router.get("/:id([0-9]*)/posts", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { offset } = req.query;
    PostService.findUserObjects(id, offset)
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json(err));
});

router.get("/:id([0-9]*)/comments", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const { offset } = req.query;
    CommentService.findUserObjects(id, offset)
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json(err));
});

export default router;
