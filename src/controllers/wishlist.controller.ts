import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';

export class WishlistController {
    private wishlistService: WishlistService;

    constructor() {
        this.wishlistService = new WishlistService();
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { childId, items } = req.body;

            if (!childId || !items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: 'Child ID and at least one item are required' });
                return;
            }

            const result = await this.wishlistService.createWishlist(childId, items);
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
