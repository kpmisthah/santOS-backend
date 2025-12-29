import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';

const router = Router();
const wishlistController = new WishlistController();

router.post('/', wishlistController.create);
router.get('/', wishlistController.getAll);
router.patch('/child/:childId/category', wishlistController.toggleCategory);

export default router;
