import { IsString, IsEmail, IsOptional, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  privyAccessToken: string;

  @IsString() name: string;
  //@IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() address?: string;
}
