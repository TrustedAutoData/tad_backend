import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterServiceAttendanceDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsNumber()
  reportId: number;

  @IsString()
  @IsNotEmpty()
  uri: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;
}