import { prisma } from '../lib/prisma';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    // Example of a generic create if needed later
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }
}
