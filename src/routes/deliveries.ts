import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';

const router = Router();
const deliveryController = new DeliveryController();

router.get('/', deliveryController.getAll);
router.get('/:id', deliveryController.getById);
router.post('/', deliveryController.create);
router.patch('/:id/status', deliveryController.updateStatus);
router.get('/track/:trackingId', deliveryController.track);

export default router;
