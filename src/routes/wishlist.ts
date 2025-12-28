import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';

const router = Router();
const wishlistController = new WishlistController();

router.post('/', wishlistController.create);
router.get('/', wishlistController.getAll);

export default router;
