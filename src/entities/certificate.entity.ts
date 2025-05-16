import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { Dealer } from './dealer.entity';
import { User } from './user.entity';

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.certificates, { nullable: false })
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column()
  service: string;

  @Column('timestamptz')
  date: Date;

  @Column('int')
  mileage: number;

  @Column('int', { nullable: true })
  nextService: number;

  @Column()
  technician: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  parts: string[];

  @Column('boolean', { default: false })
  blockchainVerified: boolean;

  @Column({ nullable: true })
  blockchainTx: string;

  @ManyToOne(() => Dealer, (dealer) => dealer.issuedCertificates, {
    nullable: false,
  })
  @JoinColumn({ name: 'dealer_id' })
  issuedBy: Dealer;

  @ManyToOne(() => User, (user) => user.certificates, { nullable: true })
  @JoinColumn({ name: 'issued_to' })
  issuedTo: User;
}
