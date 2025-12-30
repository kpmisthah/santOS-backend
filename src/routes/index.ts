import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import wishlistRoutes from './wishlist';
import analyticsRoutes from './analytics';
import taskRoutes from './tasks';
import deliveryRoutes from './deliveries';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/tasks', taskRoutes);
router.use('/deliveries', deliveryRoutes);

export default router;
