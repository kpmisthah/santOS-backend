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

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, description, giftType, quantity, assignedTo, priority, deadline } = req.body;

            // Validation
            if (!title || !giftType || !priority) {
                res.status(400).json({ error: 'Title, giftType, and priority are required' });
                return;
            }

            if (!['high', 'medium', 'low'].includes(priority.toLowerCase())) {
                res.status(400).json({ error: 'Priority must be high, medium, or low' });
                return;
            }

            const taskData = {
                title,
                description,
                giftType,
                quantity: quantity ? parseInt(quantity) : 1,
                assignedTo,
                priority: priority.toLowerCase(),
                deadline: deadline ? new Date(deadline) : undefined
            };

            const newTask = await this.taskService.createTask(taskData);
            res.status(201).json(newTask);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    };

    assign = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const { userId } = req.body;

            if (!userId) {
                res.status(400).json({ error: 'userId is required' });
                return;
            }

            const updatedTask = await this.taskService.assignTask(taskId, userId);
            res.json(updatedTask);
        } catch (error) {
            console.error('Error assigning task:', error);
            res.status(500).json({ error: 'Failed to assign task' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            await this.taskService.deleteTask(taskId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    };

    updateDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;
            const { progress, notes } = req.body;

            if (progress !== undefined && (progress < 0 || progress > 100)) {
                res.status(400).json({ error: 'Progress must be between 0 and 100' });
                return;
            }

            const updatedTask = await this.taskService.updateTaskDetails(taskId, {
                progress: progress !== undefined ? Number(progress) : undefined,
                notes
            });
            res.json(updatedTask);
        } catch (error) {
            console.error('Error updating task details:', error);
            res.status(500).json({ error: 'Failed to update task details' });
        }
    };
}
