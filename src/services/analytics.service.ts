import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
    private analyticsRepo: AnalyticsRepository;

    constructor() {
        this.analyticsRepo = new AnalyticsRepository();
    }

    async getDemandAnalysis() {
        const globalDemand = await this.analyticsRepo.getGlobalDemand();
        const regionalDemand = await this.analyticsRepo.getRegionalDemand();

        return {
            global_demand: globalDemand.map(item => ({
                gift_name: item.giftName,
                count: item._count.giftName
            })),
            regional_breakdown: regionalDemand
        };
    }

    async getProductionForecast() {
        const demand = await this.analyticsRepo.getGlobalDemand();
        const stock = await this.analyticsRepo.getGlobalStock();

        // Map stock for easy lookup
        const stockMap = new Map<string, number>();
        stock.forEach(item => {
            if (item.giftType && item._sum.quantity) {
                stockMap.set(item.giftType, item._sum.quantity);
            }
        });

        // Calculate deficit
        const forecast = demand.map(item => {
            const required = item._count.giftName;
            const available = stockMap.get(item.giftName) || 0;
            const deficit = required - available;

            return {
                item: item.giftName,
                demand: required,
                stock: available,
                status: deficit > 0 ? 'CRITICAL_SHORTAGE' : 'SUFFICIENT',
                production_suggestion: deficit > 0 ? `Please produce ${deficit} more units immediately.` : 'No action needed.'
            };
        });

        return forecast;
    }
}
