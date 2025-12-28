import { prisma } from '../lib/prisma';
import { Wishlist, WishlistItem, Prisma, Child } from '@prisma/client';

export class WishlistRepository {

    // Create a new child
    async createChild(data: Prisma.ChildCreateInput): Promise<Child> {
        return prisma.child.create({
            data
        });
    }

    // Create a new wishlist for a child
    async create(childId: string): Promise<Wishlist> {
        return prisma.wishlist.create({
            data: {
                childId
            },
            include: {
                items: true
            }
        });
    }

    // Add an item to a wishlist
    async addItem(wishlistId: string, data: Prisma.WishlistItemCreateWithoutWishlistInput): Promise<WishlistItem> {
        return prisma.wishlistItem.create({
            data: {
                ...data,
                wishlistId
            }
        });
    }

    // Get all wishlists with items and child info
    async findAll(): Promise<Wishlist[]> {
        return prisma.wishlist.findMany({
            include: {
                items: true,
                child: true
            }
        });
    }

    // Get wishlist by child ID
    async findByChildId(childId: string): Promise<Wishlist | null> {
        return prisma.wishlist.findFirst({
            where: { childId },
            include: {
                items: true,
                child: true
            }
        });
    }

    // Helper: Find child by ID ensuring they exist
    async findChildById(childId: string): Promise<Child | null> {
        return prisma.child.findUnique({
            where: { id: childId }
        });
    }
}
