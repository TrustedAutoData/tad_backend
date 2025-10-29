import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString() name: string;

  @IsString() email: string;
  //@IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() address?: string;
}
