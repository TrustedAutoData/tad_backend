import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from 'src/entities/certificate.entity';
import { Car } from 'src/entities/car.entity';
import { Dealer } from 'src/entities/dealer.entity';
import { User } from 'src/entities/user.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepo: Repository<Certificate>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    @InjectRepository(Dealer)
    private readonly dealerRepo: Repository<Dealer>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCertificateDto): Promise<Certificate> {
    const car = await this.carRepo.findOne({ where: { id: dto.carId } });
    if (!car) throw new BadRequestException(`Car with ID ${dto.carId} not found`);

    // const dealer = await this.dealerRepo.findOne({ where: { id: dto.dealerId } });
    // if (!dealer) throw new BadRequestException(`Dealer with ID ${dto.dealerId} not found`);

    const certificate = this.certificateRepo.create({
      service: dto.service,
      date: dto.date,
      mileage: dto.mileage,
      nextService: dto.nextService,
      technician: dto.technician,
      description: dto.description,
      parts: dto.parts,
      price: dto.price,
      car,
      issuedTo: car.owner, // optional — assuming Car has an owner relation
    });

    return await this.certificateRepo.save(certificate);
  }

  async findAll(filters?: any): Promise<Certificate[]> {
    const query = this.certificateRepo
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.car', 'car')
      .leftJoinAndSelect('certificate.issuedBy', 'dealer')
      .leftJoinAndSelect('certificate.issuedTo', 'user');

    if (filters?.dealerId) query.andWhere('dealer.id = :dealerId', { dealerId: filters.dealerId });
    if (filters?.carId) query.andWhere('car.id = :carId', { carId: filters.carId });
    if (filters?.userId) query.andWhere('user.id = :userId', { userId: filters.userId });

    return await query.orderBy('certificate.date', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Certificate> {
    const cert = await this.certificateRepo.findOne({
      where: { id },
      relations: ['car', 'issuedBy', 'issuedTo'],
    });

    if (!cert) throw new NotFoundException(`Certificate with ID ${id} not found`);
    return cert;
  }

  async update(id: string, partial: Partial<CreateCertificateDto>): Promise<Certificate> {
    const cert = await this.findOne(id);

    if (partial.carId) {
      const car = await this.carRepo.findOne({ where: { id: partial.carId } });
      if (!car) throw new BadRequestException(`Car with ID ${partial.carId} not found`);
      cert.car = car;
    }

    // if (partial.dealerId) {
    //   const dealer = await this.dealerRepo.findOne({ where: { id: partial.dealerId } });
    //   if (!dealer) throw new BadRequestException(`Dealer with ID ${partial.dealerId} not found`);
    //   cert.issuedBy = dealer;
    // }

    Object.assign(cert, {
      ...partial,
      date: partial.date ? new Date(partial.date) : cert.date,
    });

    return await this.certificateRepo.save(cert);
  }

  async remove(id: string): Promise<void> {
    const cert = await this.findOne(id);
    await this.certificateRepo.remove(cert);
  }
}
