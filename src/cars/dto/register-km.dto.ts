import { IsNumber, IsString } from "class-validator";

export class RegisterCarKmDto {
    @IsString()
    vin: string;
    @IsNumber()
    km: number;
  }
  