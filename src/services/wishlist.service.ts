import { WishlistRepository } from '../repositories/wishlist.repository';
import { Priority, Status } from '@prisma/client';

export class WishlistService {
    private wishlistRepo: WishlistRepository;

    constructor() {
        this.wishlistRepo = new WishlistRepository();
    }

    async createWishlist(childId: string, items: { giftName: string, description?: string, priority: Priority }[]) {
        // 1. Verify child exists
        const child = await this.wishlistRepo.findChildById(childId);
        if (!child) {
            throw new Error('Child not found');
        }

        // 2. Check if wishlist already exists, if so use it, otherwise create new
        let wishlist = await this.wishlistRepo.findByChildId(childId);
        if (!wishlist) {
            wishlist = await this.wishlistRepo.create(childId);
        }

        // 3. Add items
        const addedItems = [];
        for (const item of items) {
            const newItem = await this.wishlistRepo.addItem(wishlist.id, {
                giftName: item.giftName,
                description: item.description,
                priority: item.priority || Priority.medium,
                status: Status.pending
            });
            addedItems.push(newItem);
        }

        return { wishlist, newItems: addedItems };
    }

    async getAllWishlists() {
        return this.wishlistRepo.findAll();
    }
}
