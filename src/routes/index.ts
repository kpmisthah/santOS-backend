import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import wishlistRoutes from './wishlist';
import analyticsRoutes from './analytics';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
