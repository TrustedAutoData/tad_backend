import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificatesService {
  findAll(filters: any) {
    return [];
  }
  create(dto: CreateCertificateDto) {
    return { id: 'new-cert', ...dto };
  }
  findOne(id: string) {
    return { id };
  }
}
