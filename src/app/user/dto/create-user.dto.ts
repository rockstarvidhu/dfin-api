import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsEmail, IsEnum } from "class-validator";
import { Role, RoleType } from "../../../shared/types";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe", description: "User Name" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "JohnDoe@gmail.com", description: "User Email" })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: Role.USER_ADMIN,
    enum: Role,
    default: Role.USER_ADMIN,
    description: "User Role",
  })
  @IsEnum(Role)
  role!: RoleType;

  @ApiProperty({ example: "1234", description: "User Password" })
  @IsString()
  @MinLength(4)
  password!: string;
}
