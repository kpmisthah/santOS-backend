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
}
