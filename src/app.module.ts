import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Car, Certificate, Dealer, User } from './entities';
import { CarsModule } from './cars/cars.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrivyModule } from './privy/privy.module';
import { PrivyModuleOptions } from './privy/types/privy.types';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrivyModule.registerAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<PrivyModuleOptions> => ({
        applicationId: configService.get<string>('PRIVY_APP_ID') || '',
        secret: configService.get<string>('PRIVY_SECRET') || '',
      }),
      inject: [ConfigService],
    }),
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
    CarsModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
