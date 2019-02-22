import express, { Router } from 'express';
import { CommentService } from '../services/CommentService';

const service: CommentService = new CommentService();
const router: Router = express.Router();



export default router;
