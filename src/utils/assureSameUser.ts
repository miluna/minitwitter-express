import { Request, Response, NextFunction } from 'express';

const assureSameUser = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    if (user && id && parseInt(id) === parseInt(user.id)) {
        next();
    } else {
        res.send(401);
    }
};

export default assureSameUser;
