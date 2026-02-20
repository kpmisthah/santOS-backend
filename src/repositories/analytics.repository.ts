import { prisma } from '../lib/prisma';
import { TaskStatus } from '@prisma/client';

export class AnalyticsRepository {

    async getGlobalDemand() {
        return prisma.wishlistItem.groupBy({
            by: ['giftName'],
            _count: {
                giftName: true
            },
            orderBy: {
                _count: {
                    giftName: 'desc'
                }
            }
        });
    }

    async getGlobalStock() {
        return prisma.task.groupBy({
            by: ['giftType'],
            where: {
                status: TaskStatus.completed
            },
            _sum: {
                quantity: true
            }
        });
    }

    async getRegionalDemand() {
    

        return prisma.$queryRaw`
            SELECT c.location, c.age, wi.gift_name as "giftName", COUNT(*)::int as count
            FROM wishlist_items wi
            JOIN wishlists w ON wi.wishlist_id = w.id
            JOIN children c ON w.child_id = c.id
            GROUP BY c.location, c.age, wi.gift_name
            ORDER BY count DESC
        `;
    }

    async getDashboardStats() {
        const [
            totalChildren,
            totalGifts,
            pendingTasks,
            completedTasks,
            pendingDeliveries,
            completedDeliveries,
            niceChildren,
            naughtyChildren
        ] = await Promise.all([
            prisma.child.count(),
            prisma.wishlistItem.count(),
            prisma.task.count({ where: { status: TaskStatus.pending } }),
            prisma.task.count({ where: { status: TaskStatus.completed } }),
            prisma.delivery.count({ where: { status: 'pending' } }),
            prisma.delivery.count({ where: { status: 'delivered' } }),
            prisma.child.count({ where: { category: 'nice' } }),
            prisma.child.count({ where: { category: 'naughty' } })
        ]);

        return {
            totalChildren,
            totalGifts,
            pendingTasks,
            completedTasks,
            pendingDeliveries,
            completedDeliveries,
            niceChildren,
            naughtyChildren
        };
    }
}
