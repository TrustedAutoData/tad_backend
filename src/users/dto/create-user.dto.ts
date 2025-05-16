import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() address?: string;
}
