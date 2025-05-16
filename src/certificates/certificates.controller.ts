import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly svc: CertificatesService) {}

  @Get()
  findAll(
    @Query('carId') carId?: string,
    @Query('dealerId') dealerId?: string,
    @Query('search') search?: string,
  ) {
    return this.svc.findAll({ carId, dealerId, search });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCertificateDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
