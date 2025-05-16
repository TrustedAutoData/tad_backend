import {
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString() carId: string;
  @IsString() service: string;
  @IsString() date: string;
  @IsInt() mileage: number;
  @IsInt() @IsOptional() nextService?: number;
  @IsString() technician: string;
  @IsString() @IsOptional() description?: string;
  @IsArray() parts: string[];
  @IsString() dealerId: string;
}
