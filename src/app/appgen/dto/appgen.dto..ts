import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class BuildAppDto {
  @ApiProperty({ example: "image_1", required: true })
  @IsString()
  @IsNotEmpty()
  background_image: string;

  @ApiProperty({ example: "red" })
  @IsNotEmpty()
  @IsString()
  background_color: string;
}
