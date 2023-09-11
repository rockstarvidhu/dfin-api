import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class BuildAppDto {
  @ApiProperty({ example: "image_1", required: true })
  @IsString()
  @IsNotEmpty()
  backgroundImage!: string;

  @ApiProperty({ example: "red" })
  @IsNotEmpty()
  @IsString()
  backgroundColor!: string;
}
