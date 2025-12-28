import { WishlistRepository } from '../repositories/wishlist.repository';
import { Priority, Status, Category } from '@prisma/client';

export class WishlistService {
    private wishlistRepo: WishlistRepository;

    constructor() {
        this.wishlistRepo = new WishlistRepository();
    }

    async createWishlist(
        childData: { name: string, age: number, location: string, status: 'nice' | 'naughty' },
        items: { item: string, priority: 'high' | 'medium' | 'low' }[]
    ) {
        // 1. Create Child (Assume every submission is a new child for this demo, or simplistic matching)
        // Ideally we would search by name/age/location to find existing, but let's just create new for simplicity/volume.
        const child = await this.wishlistRepo.createChild({
            name: childData.name,
            age: childData.age,
            location: childData.location,
            category: childData.status === 'nice' ? Category.nice : Category.naughty
        });

        // 2. Create Wishlist for this new child
        const wishlist = await this.wishlistRepo.create(child.id);

        // 3. Add items
        const addedItems = [];
        for (const item of items) {
            // Map string priority to Enum
            let priorityEnum: Priority = Priority.medium;
            if (item.priority === 'high') priorityEnum = Priority.high;
            if (item.priority === 'low') priorityEnum = Priority.low;

            const newItem = await this.wishlistRepo.addItem(wishlist.id, {
                giftName: item.item,
                priority: priorityEnum,
                status: Status.pending
            });
            addedItems.push(newItem);
        }

        return { child, wishlist, items: addedItems };
    }

    async getAllWishlists() {
        return this.wishlistRepo.findAll();
    }
}
