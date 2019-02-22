import express, { Router } from 'express';
import { PostService } from '../services/PostService';

const service: PostService = new PostService();
const router: Router = express.Router();



export default router;
