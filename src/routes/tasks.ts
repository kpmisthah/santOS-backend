import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.get('/user/:userId', taskController.getByUser);
router.patch('/:taskId/status', taskController.updateStatus);
router.get('/', taskController.getAll);

export default router;
