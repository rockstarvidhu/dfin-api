import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class deleteUserDto {
  @ApiProperty({ example: "john@gmail.com", description: "Email" })
  @IsString()
  email: string;
}
