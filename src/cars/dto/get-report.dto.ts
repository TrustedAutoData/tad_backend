import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetReportDataDto {
    @IsString()
    @IsNotEmpty()
    vin: string;
  
    @IsNumber()
    @IsNotEmpty()
    reportId: number;
  }