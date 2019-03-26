import express, { Router } from 'express';
import { CommentService } from '../services/CommentService';

const service: CommentService = new CommentService();
const router: Router = express.Router();

// TODO: implement router

export default router;
