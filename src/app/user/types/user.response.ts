import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;
  @ApiProperty()
  status!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  id!: string;
}
export class UsersResponse {
  @ApiProperty({ type: [UserResponse] })
  users!: UserResponse[];
}
