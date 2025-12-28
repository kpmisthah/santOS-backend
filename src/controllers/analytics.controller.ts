import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    getDemand = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.analyticsService.getDemandAnalysis();
            res.json(data);
        } catch (error) {
            console.error('Error fetching demand:', error);
            res.status(500).json({ error: 'Failed to fetch demand analytics' });
        }
    };

    getForecast = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.analyticsService.getProductionForecast();
            res.json(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            res.status(500).json({ error: 'Failed to fetch production forecast' });
        }
    };

    getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.analyticsService.getDashboardStats();
            res.json(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard stats' });
        }
    };
}
