import express from 'express';
import passport from 'passport';
import { auth } from "./config/passport";
import UserController from "./controllers/UserController";
import CommentController from "./controllers/CommentController";
import PostController from "./controllers/PostController";

const app = express();
// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
auth(passport);

// Use Routes
app.get("/health", (req, res) => res.sendStatus(200));
app.get("/currentuser", passport.authenticate("jwt", {session: false}), (req, res) => {
    const { user } = req;
    res.status(200).json(user);
});
app.use("/users", UserController);
app.use("/comments", CommentController);
app.use("/posts", PostController);


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
