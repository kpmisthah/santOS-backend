import { Request, Response } from 'express';
import { DeliveryService } from '../services/delivery.service';

export class DeliveryController {
    private deliveryService: DeliveryService;

    constructor() {
        this.deliveryService = new DeliveryService();
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status } = req.query;

            if (status && typeof status === 'string') {
                const deliveries = await this.deliveryService.getDeliveriesByStatus(
                    status as 'pending' | 'in_transit' | 'delivered'
                );
                res.json(deliveries);
            } else {
                const deliveries = await this.deliveryService.getAllDeliveries();
                res.json(deliveries);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            res.status(500).json({ error: 'Failed to fetch deliveries' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const delivery = await this.deliveryService.getDeliveryById(id);
            res.json(delivery);
        } catch (error: any) {
            console.error('Error fetching delivery:', error);
            if (error.message === 'Delivery not found') {
                res.status(404).json({ error: 'Delivery not found' });
            } else {
                res.status(500).json({ error: 'Failed to fetch delivery' });
            }
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { childId, region, address, giftItems, deliveryDate } = req.body;

            // Validation
            if (!region || !address || !giftItems || !Array.isArray(giftItems)) {
                res.status(400).json({
                    error: 'Region, address, and giftItems (array) are required'
                });
                return;
            }

            if (giftItems.length === 0) {
                res.status(400).json({ error: 'At least one gift item is required' });
                return;
            }

            const deliveryData = {
                childId,
                region,
                address,
                giftItems,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined
            };

            const newDelivery = await this.deliveryService.createDelivery(deliveryData);
            res.status(201).json(newDelivery);
        } catch (error) {
            console.error('Error creating delivery:', error);
            res.status(500).json({ error: 'Failed to create delivery' });
        }
    };

    updateStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || !['pending', 'in_transit', 'delivered'].includes(status)) {
                res.status(400).json({
                    error: 'Valid status is required (pending, in_transit, delivered)'
                });
                return;
            }

            const updatedDelivery = await this.deliveryService.updateDeliveryStatus(id, status);
            res.json(updatedDelivery);
        } catch (error: any) {
            console.error('Error updating delivery status:', error);
            if (error.message === 'Delivery not found') {
                res.status(404).json({ error: 'Delivery not found' });
            } else {
                res.status(500).json({ error: 'Failed to update delivery' });
            }
        }
    };

    track = async (req: Request, res: Response): Promise<void> => {
        try {
            const { trackingId } = req.params;
            const trackingInfo = await this.deliveryService.trackDelivery(trackingId);
            
            // Prevent caching so progress updates show immediately
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            
            res.json(trackingInfo);
        } catch (error: any) {
            console.error('Error tracking delivery:', error);
            if (error.message === 'Tracking ID not found') {
                res.status(404).json({ error: 'Tracking ID not found' });
            } else {
                res.status(500).json({ error: 'Failed to track delivery' });
            }
        }
    };
}
