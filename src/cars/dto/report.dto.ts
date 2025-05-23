import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetReportDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsNumber()
  reportId: number;

  @IsString()
  @IsNotEmpty()
  reportType: string;
}

export class ReportCarErrorDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsNumber()
  errorCode: number;

  @IsString()
  @IsNotEmpty()
  errorMessage: string;
}