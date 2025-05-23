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
import { RegisterCarKmDto } from './dto/register-km.dto';
import { RegisterServiceAttendanceDto } from './dto/register-service-attendance.dto';
import { GetReportDto, ReportCarErrorDto } from './dto/report.dto';
import { AddUserPointsDto } from './dto/add-user-points.dto';
import { GetCarDataDto } from './dto/get-car-data.dto';
import { GetReportDataDto } from './dto/get-report.dto';
import { GetDealerReportDataDto } from './dto/get-dealer-report.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carService: CarsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('dealerId') dealerId?: string,
    @Query('search') search?: string,
  ) {
    return this.carService.findAll({ status, dealerId, search });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }

  @Get(':id/telemetry')
  getTelemetry(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.carService.getTelemetry(id, from, to);
  }

  @Get(':id/blockchain')
  getBlockchain(@Param('id') id: string, @Query('limit') limit = 10) {
    return this.carService.getBlockchain(id, limit);
  }

  @Post('register-km')
  async registerCarKm(@Body() dto: RegisterCarKmDto) {
    const { vin, km } = dto;
    const tx = await this.carService.registerCarKm(vin, km);
    return { transaction: tx };
  }

  @Post('register-service')
  async registerServiceAttendance(@Body() dto: RegisterServiceAttendanceDto) {
    const { vin, reportId, serviceType } = dto;
    const tx = await this.carService.registerServiceAttendance(vin, reportId, serviceType);
    return { transaction: tx };
  }

  @Post('get-report')
  async getReport(@Body() dto: GetReportDto) {
    const { vin, reportId, reportType } = dto;
    const tx = await this.carService.getReport(vin, reportId, reportType);
    return { transaction: tx };
  }

  @Post('report-error')
  async reportCarError(@Body() dto: ReportCarErrorDto) {
    const { vin, errorCode, errorMessage } = dto;
    const tx = await this.carService.reportCarError(vin, errorCode, errorMessage);
    return { transaction: tx };
  }

  @Post('add-points')
  async addUserPoints(@Body() dto: AddUserPointsDto) {
    const { points } = dto;
    const tx = await this.carService.addUserPoints(points);
    return { transaction: tx };
  }

  @Post('get-data')
  async getCarData(@Body() dto: GetCarDataDto) {
    console.log('Received DTO in getCarData:', JSON.stringify(dto));
    const { vin } = dto;
    console.log(`Extracted vin: ${vin}`);
    const carData = await this.carService.getCarData(vin);
    return { carData };
  }

  @Post('get-report-data')
  async getReportData(@Body() dto: GetReportDataDto) {
    console.log('Received DTO in getReportData:', JSON.stringify(dto));
    const { vin, reportId } = dto;
    console.log(`Extracted vin: ${vin}, reportId: ${reportId}`);
    const reportData = await this.carService.getReportData(vin, reportId);
    return { reportData };
  }

  @Post('get-dealer-report-data')
  async getDealerReportData(@Body() dto: GetDealerReportDataDto) {
    console.log('Received DTO in getDealerReportData:', JSON.stringify(dto));
    const { vin, reportId } = dto;
    console.log(`Extracted vin: ${vin}, reportId: ${reportId}`);
    const dealerReportData = await this.carService.getDealerReportData(vin, reportId);
    return { dealerReportData };
  }

  @Post('user-data')
  async getUserData() {
    const userData = await this.carService.getUserData();
    return { userData };
  }
}
