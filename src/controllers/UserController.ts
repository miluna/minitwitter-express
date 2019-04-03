import express, { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import passport from 'passport';

const service: UserService = new UserService();
const router: Router = express.Router();


router.get("/", (req: Request, res: Response, next: NextFunction) => {
    service.findAll()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json(err));
})


router.post("/", (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    service.createOne(user)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
})


router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.findById(id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
})

router.put("/:id", passport.authenticate("jwt", {session: false}) , (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const updatedUser = req.body;
    service.updateOne(id, updatedUser)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
})

router.delete("/:id", passport.authenticate("jwt", {session: false}), (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    service.deleteOne(id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(404).json(err));
})

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    service.login(user)
        .then(auth => res.status(200).json(auth))
        .catch(err => res.status(400).json(err));
})

export default router;
