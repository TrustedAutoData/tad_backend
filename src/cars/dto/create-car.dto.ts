import { IsString, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateCarDto {
  @IsString() @IsNotEmpty() make: string;
  @IsString() @IsNotEmpty() model: string;
  @IsInt() year: number;
  @IsInt() @IsPositive() mileage: number;
  @IsString() @IsNotEmpty() vin: string;
  @IsString() @IsOptional() licensePlate?: string;
  @IsString() @IsNotEmpty() ownerId: string;
}
