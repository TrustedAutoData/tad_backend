import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetDealerReportDataDto {
    @IsString()
    @IsNotEmpty()
    vin: string;
  
    @IsNumber()
    @IsNotEmpty()
    reportId: number;
  }