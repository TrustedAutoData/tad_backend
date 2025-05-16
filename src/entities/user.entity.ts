import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { Certificate } from './certificate.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  joined: Date;

  @Column('int', { default: 0 })
  points: number;

  @Column('int', { default: 1 })
  level: number;

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];

  @OneToMany(() => Certificate, (cert) => cert.issuedTo)
  certificates: Certificate[];
}
