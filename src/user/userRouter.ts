import { Router } from 'express';
import { createUser } from './userController';
import { loginUser } from './userController';

const router = Router();

// Define the createUser route
router.post('/register', createUser);
router.post('/login',loginUser);

export default router;