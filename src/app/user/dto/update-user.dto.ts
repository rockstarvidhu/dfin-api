import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsEmail, IsEnum } from "class-validator";
import { Role, RoleType } from "../../../shared/types";

export class UpdateUserDto {
  @ApiProperty({
    example: "John Doe",
    description: "User Name",
    required: false,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: "JohnDoe@gmail.com",
    description: "User Email",
    required: false,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: Role.USER_ADMIN,
    enum: Role,
    description: "User Role",
    required: false,
  })
  @IsEnum(Role)
  role!: RoleType;
}
