import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('stats')
  stats() {
    return this.svc.getStats();
  }

  @Get('charts/:type')
  charts(@Param('type') type: string) {
    return this.svc.getChart(type);
  }
}
