import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getStats() {
    return {
      connectedCars: 0,
      activeUsers: 0,
      certificatesIssued: 0,
      pendingServices: 0,
    };
  }

  getChart(type: string) {
    return { data: [] };
  }
}
