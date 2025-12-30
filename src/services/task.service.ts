import { TaskRepository } from '../repositories/task.repository';
import { TaskStatus } from '@prisma/client';

export class TaskService {
    private taskRepo: TaskRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
    }

    async getTasksByUser(userId: string) {
        return this.taskRepo.findByUserId(userId);
    }

    async updateTaskStatus(taskId: string, status: 'pending' | 'in_progress' | 'completed') {
        let statusEnum: TaskStatus;
        switch (status) {
            case 'in_progress':
                statusEnum = TaskStatus.in_progress;
                break;
            case 'completed':
                statusEnum = TaskStatus.completed;
                break;
            default:
                statusEnum = TaskStatus.pending;
        }
        return this.taskRepo.updateStatus(taskId, statusEnum);
    }

    async getAllTasks() {
        return this.taskRepo.findAll();
    }

    async createTask(data: {
        title: string;
        description?: string;
        giftType: string;
        quantity?: number;
        assignedTo?: string;
        priority: 'high' | 'medium' | 'low';
        deadline?: Date;
    }) {
        const { priority, ...rest } = data;

        return this.taskRepo.create({
            ...rest,
            priority: priority.toLowerCase() as 'high' | 'medium' | 'low',
            quantity: data.quantity || 1
        });
    }

    async assignTask(taskId: string, userId: string) {
        return this.taskRepo.update(taskId, {
            assignee: {
                connect: { id: userId }
            }
        });
    }

    async deleteTask(id: string) {
        return this.taskRepo.delete(id);
    }

    async updateTaskDetails(taskId: string, data: { progress?: number; notes?: string }) {
        return this.taskRepo.update(taskId, data);
    }
}
