import express, { Router } from 'express';
import { UserService } from '../services/UserService';

const service: UserService = new UserService();
const router: Router = express.Router();



export default router;
