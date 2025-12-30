import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.get('/user/:userId', taskController.getByUser);
router.patch('/:taskId/status', taskController.updateStatus);
router.patch('/:taskId/assign', taskController.assign);
router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.delete('/:taskId', taskController.delete);
router.patch('/:taskId', taskController.updateDetails);

export default router;
