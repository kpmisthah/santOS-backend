import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/demand', analyticsController.getDemand);
router.get('/forecast', analyticsController.getForecast);

export default router;
