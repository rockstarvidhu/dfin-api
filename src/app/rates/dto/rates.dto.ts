import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class updatePercentDto {
  @ApiProperty({ example: 4, required: true })
  @IsNumber()
  @IsNotEmpty()
  percentageChange: number;
}
