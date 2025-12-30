import { DeliveryRepository } from '../repositories/delivery.repository';
import { DeliveryStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class DeliveryService {
    private deliveryRepo: DeliveryRepository;

    constructor() {
        this.deliveryRepo = new DeliveryRepository();
    }

    async getAllDeliveries() {
        return this.deliveryRepo.findAll();
    }

    async getDeliveryById(id: string) {
        const delivery = await this.deliveryRepo.findById(id);
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        return delivery;
    }

    async createDelivery(data: {
        childId?: string;
        region: string;
        address: string;
        giftItems: string[];
        deliveryDate?: Date;
    }) {
        return this.deliveryRepo.create({
            region: data.region,
            address: data.address,
            giftItems: data.giftItems,
            deliveryDate: data.deliveryDate,
            ...(data.childId && {
                child: {
                    connect: { id: data.childId }
                }
            })
        });
    }

    async updateDeliveryStatus(id: string, status: 'pending' | 'in_transit' | 'delivered') {
        let statusEnum: DeliveryStatus;
        switch (status) {
            case 'in_transit':
                statusEnum = DeliveryStatus.in_transit;
                break;
            case 'delivered':
                statusEnum = DeliveryStatus.delivered;
                break;
            default:
                statusEnum = DeliveryStatus.pending;
        }
        return this.deliveryRepo.updateStatus(id, statusEnum);
    }

    async getDeliveriesByStatus(status: 'pending' | 'in_transit' | 'delivered') {
        let statusEnum: DeliveryStatus;
        switch (status) {
            case 'in_transit':
                statusEnum = DeliveryStatus.in_transit;
                break;
            case 'delivered':
                statusEnum = DeliveryStatus.delivered;
                break;
            default:
                statusEnum = DeliveryStatus.pending;
        }
        return this.deliveryRepo.findByStatus(statusEnum);
    }

    // Track delivery by ID (for public tracking)
    async trackDelivery(trackingId: string) {
        const delivery = await this.deliveryRepo.findById(trackingId);
        if (!delivery) {
            throw new Error('Tracking ID not found');
        }

        // Check production status of tasks for this child
        let productionStatus = 'pending';
        let productionProgress = 0;

        if (delivery.childId && (delivery as any).child?.name) {
            const task = await prisma.task.findFirst({
                where: {
                    title: { contains: (delivery as any).child.name, mode: 'insensitive' }
                }
            });

            if (task) {
                productionProgress = task.progress || 0;
                if (task.status === 'completed') {
                    productionStatus = 'completed';
                    productionProgress = 100;
                } else if (task.status === 'in_progress') {
                    productionStatus = 'in_progress';
                }
            }
        }

        // Return limited info for public tracking
        return {
            id: delivery.id,
            status: delivery.status,
            productionStatus,
            productionProgress,
            region: delivery.region,
            deliveryDate: delivery.deliveryDate,
            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt
        };
    }
}
