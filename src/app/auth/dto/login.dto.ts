import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, IsJWT } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@buk.com", required: true })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: "admin" })
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refreshToken!: string;
}
