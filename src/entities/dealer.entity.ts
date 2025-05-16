import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Car } from './car.entity';
import { Certificate } from './certificate.entity';

export enum DealerType {
  ServiceCenter = 'Service Center',
  Dealership = 'Dealership',
  RepairShop = 'Repair Shop',
  InspectionCenter = 'Inspection Center',
}

export enum AccessLevel {
  Full = 'Full',
  Limited = 'Limited',
  ReadOnly = 'ReadOnly',
}

@Entity({ name: 'dealers' })
export class Dealer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: DealerType })
  type: DealerType;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.ReadOnly })
  accessLevel: AccessLevel;

  @OneToMany(() => Car, (car) => car.dealer)
  cars: Car[];

  @OneToMany(() => Certificate, (cert) => cert.issuedBy)
  issuedCertificates: Certificate[];
}
