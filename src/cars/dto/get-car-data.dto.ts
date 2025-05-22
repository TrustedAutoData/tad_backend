import { IsNotEmpty, IsString } from "class-validator";

export class GetCarDataDto {
    @IsString()
    @IsNotEmpty()
    vin: string;
  }