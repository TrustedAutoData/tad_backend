import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Car, Certificate, Dealer, User } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get('DB_HOST'),
        port: cs.get<number>('DB_PORT'),
        username: cs.get('DB_USER'),
        password: cs.get('DB_PASS'),
        database: cs.get('DB_NAME'),
        entities: [Car, User, Dealer, Certificate],
        synchronize: true, // disable in prod
      }),
    }),
    TypeOrmModule.forFeature([Car, User, Dealer, Certificate]),
    // ... your modules here
  ],
})
export class AppModule {}
