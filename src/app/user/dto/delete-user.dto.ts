import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class DeleteUserDto {
  @ApiProperty({ example: "john@gmail.com", description: "Email" })
  @IsString()
  email!: string;
}
