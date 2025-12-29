import { prisma } from '../lib/prisma';
import { Task, Prisma, TaskStatus } from '@prisma/client';

export class TaskRepository {
    // Get all tasks assigned to a specific user
    async findByUserId(userId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: { assignedTo: userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Update task status
    async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
        return prisma.task.update({
            where: { id: taskId },
            data: { status }
        });
    }

    // Get all tasks
    async findAll(): Promise<Task[]> {
        return prisma.task.findMany({
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
