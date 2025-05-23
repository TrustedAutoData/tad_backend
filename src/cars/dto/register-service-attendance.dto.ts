import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterServiceAttendanceDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsNumber()
  reportId: number;

  @IsString()
  @IsNotEmpty()
  serviceType: string;
}