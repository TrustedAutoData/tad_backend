import { IsNumber, IsString, IsUUID } from "class-validator";

export class RegisterCarKmDto {
  @IsString()
  vin: string;
  @IsNumber()
  km: number;
  @IsString() @IsUUID()
  id: string;
}
