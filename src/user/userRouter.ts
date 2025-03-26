import { Router } from 'express';
import { createUser } from './userController';

const router = Router();

// Define the createUser route
router.post('/register', createUser);

export default router;