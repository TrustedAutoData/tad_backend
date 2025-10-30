import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Certificate, Dealer, User } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, Car, Dealer, User]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService]
})
export class CertificatesModule { }
