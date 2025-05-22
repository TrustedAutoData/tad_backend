import { IsNumber } from "class-validator";

export class AddUserPointsDto {
    @IsNumber()
    points: number;
}