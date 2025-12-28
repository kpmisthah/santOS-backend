import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';

export class WishlistController {
    private wishlistService: WishlistService;

    constructor() {
        this.wishlistService = new WishlistService();
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, age, location, status, wishes } = req.body;

            if (!name || !age || !location || !wishes || !Array.isArray(wishes) || wishes.length === 0) {
                res.status(400).json({ error: 'Name, age, location, and at least one wish are required' });
                return;
            }

            const result = await this.wishlistService.createWishlist(
                { name, age, location, status },
                wishes
            );
            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error creating wishlist:', error);
            if (error.message === 'Child not found') {
                res.status(404).json({ error: 'Child not found' });
            } else {
                res.status(500).json({ error: 'Failed to create wishlist' });
            }
        }
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const wishlists = await this.wishlistService.getAllWishlists();
            res.json(wishlists);
        } catch (error) {
            console.error('Error fetching wishlists:', error);
            res.status(500).json({ error: 'Failed to fetch wishlists' });
        }
    };
}
