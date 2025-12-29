import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    getByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const tasks = await this.taskService.getTasksByUser(userId);
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    };

    updateStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const { status } = req.body;

            if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
                res.status(400).json({ error: 'Valid status is required' });
                return;
            }

            const updatedTask = await this.taskService.updateTaskStatus(taskId, status);
            res.json(updatedTask);
        } catch (error) {
            console.error('Error updating task status:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await this.taskService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    };
}
