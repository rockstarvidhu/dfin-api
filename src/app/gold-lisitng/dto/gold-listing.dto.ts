import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateListingDto {
  @ApiProperty({ example: "Gold OZ", required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: string;

  @ApiProperty({ example: 100, required: true })
  @IsNumber()
  @IsNotEmpty()
  price: string;
}
