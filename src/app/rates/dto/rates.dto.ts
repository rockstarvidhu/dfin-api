import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePercentDto {
  @ApiProperty({ example: 4, required: true })
  @IsNumber()
  @IsNotEmpty()
  percentageChange!: number;
}
