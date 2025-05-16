import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString() @IsNotEmpty() make: string;
  @IsString() @IsNotEmpty() model: string;
  @IsInt() year: number;
  @IsString() @IsNotEmpty() vin: string;
  @IsString() @IsOptional() licensePlate?: string;
  @IsString() @IsNotEmpty() ownerId: string;
}
