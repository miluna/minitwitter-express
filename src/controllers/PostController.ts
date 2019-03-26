import express, { Router } from 'express';
import { PostService } from '../services/PostService';

const service: PostService = new PostService();
const router: Router = express.Router();

// TODO: implement router

export default router;
