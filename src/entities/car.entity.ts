import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Dealer } from './dealer.entity';
import { Certificate } from './certificate.entity';

export enum CarStatus {
  Connected = 'Connected',
  NotConnected = 'Not Connected',
  Offline = 'Offline',
  Pending = 'Pending',
}

@Entity({ name: 'cars' })
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column('int')
  year: number;

  @Column({ unique: true })
  vin: string;

  @Column({ nullable: true })
  licensePlate: string;

  @ManyToOne(() => User, (user) => user.cars, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'enum', enum: CarStatus, default: CarStatus.Pending })
  status: CarStatus;

  @Column('int', { default: 0 })
  mileage: number;

  @UpdateDateColumn()
  lastUpdate: Date;

  @Column({ type: 'jsonb', nullable: true })
  telemetryData: {
    engineTemp?: string;
    batteryVoltage?: string;
    fuelLevel?: string;
    oilLife?: string;
    tirePressure?: {
      frontLeft?: string;
      frontRight?: string;
      rearLeft?: string;
      rearRight?: string;
    };
    dtcCodes?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  blockchainData: {
    transactions?: number;
    lastTransaction?: string;
    address?: string;
  };

  @ManyToOne(() => Dealer, (dealer) => dealer.cars, { nullable: true })
  @JoinColumn({ name: 'dealer_id' })
  dealer: Dealer;

  @OneToMany(() => Certificate, (cert) => cert.car)
  certificates: Certificate[];

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  dealerAccess: string[];
}
