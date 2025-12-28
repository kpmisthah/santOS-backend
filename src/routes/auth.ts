import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// POST /api/auth/login
router.post('/login', authController.login);

export default router;
