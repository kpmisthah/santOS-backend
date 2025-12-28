import { prisma } from '../lib/prisma';
import { TaskStatus } from '@prisma/client';

export class AnalyticsRepository {

    // 1. Group toys by name and count demand (Wishlist items pending or approved)
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

    // 2. Count current stock (Completed Tasks)
    async getGlobalStock() {
        return prisma.task.groupBy({
            by: ['giftType'], // Assuming giftType corresponds to giftName roughly, or we map it
            where: {
                status: TaskStatus.completed
            },
            _sum: {
                quantity: true
            }
        });
    }

    // 3. Get regional demand (Requires joining Wishlist -> Child)
    // Prisma groupBy doesn't support deep relations easily, so we fetch and aggregate or use raw query.
    // Raw query is often faster for analytics.
    async getRegionalDemand() {
        /*
         Query:
         SELECT c.region, c.age, wi."giftName", COUNT(*) as count
         FROM "wishlist_items" wi
         JOIN "wishlists" w ON wi."wishlist_id" = w.id
         JOIN "children" c ON w."child_id" = c.id
         GROUP BY c.region, c.age, wi."giftName"
        */
        // Since Child has 'location', let's use that as region.

        // Note: Prisma raw query returns unknown[], so we cast or map it.
        // Also note: "giftName" is camelCase in map but might be snake_case in DB if mapped.
        // checking schema: giftName @map("gift_name"), location is just location.

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
            prisma.delivery.count({ where: { status: 'pending' } }), // Assuming string literal if enum import issue
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
