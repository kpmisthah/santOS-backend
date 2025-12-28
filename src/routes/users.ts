import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get('/', userController.getUsers);

export default router;
