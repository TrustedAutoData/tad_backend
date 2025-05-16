import { Controller, Get, Param, Query } from '@nestjs/common';
import { DealersService } from './dealers.service';

@Controller('dealers')
export class DealersController {
  constructor(private readonly svc: DealersService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.svc.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
