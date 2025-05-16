import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly svc: CarsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('dealerId') dealerId?: string,
    @Query('search') search?: string,
  ) {
    return this.svc.findAll({ status, dealerId, search });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCarDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Get(':id/telemetry')
  getTelemetry(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.svc.getTelemetry(id, from, to);
  }

  @Get(':id/blockchain')
  getBlockchain(@Param('id') id: string, @Query('limit') limit = 10) {
    return this.svc.getBlockchain(id, limit);
  }
}
