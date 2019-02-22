import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { auth } from "./config/passport";
import UserController from "./controllers/UserController";
import CommentController from "./controllers/CommentController";
import PostController from "./controllers/PostController";

const app = express();
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
auth(passport);

// Use Routes
app.use("/users", UserController);
app.use("/comments", CommentController);
app.use("/posts", PostController);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
