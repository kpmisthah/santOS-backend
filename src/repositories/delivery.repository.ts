import { prisma } from '../lib/prisma';
import { Delivery, Prisma, DeliveryStatus } from '@prisma/client';

export class DeliveryRepository {
    // Get all deliveries
    async findAll(): Promise<Delivery[]> {
        return prisma.delivery.findMany({
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Get delivery by ID
    async findById(id: string): Promise<Delivery | null> {
        return prisma.delivery.findUnique({
            where: { id },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            }
        });
    }

    // Create a new delivery
    async create(data: Prisma.DeliveryCreateInput): Promise<Delivery> {
        return prisma.delivery.create({
            data,
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            }
        });
    }

    // Update delivery status
    async updateStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
        return prisma.delivery.update({
            where: { id },
            data: { status },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            }
        });
    }

    // Update delivery
    async update(id: string, data: Prisma.DeliveryUpdateInput): Promise<Delivery> {
        return prisma.delivery.update({
            where: { id },
            data,
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            }
        });
    }

    // Get deliveries by status
    async findByStatus(status: DeliveryStatus): Promise<Delivery[]> {
        return prisma.delivery.findMany({
            where: { status },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        category: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
