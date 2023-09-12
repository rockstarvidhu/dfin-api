import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../../shared/decorators/auth.decorator";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponse, UsersResponse } from "./types/user.response";

@ApiTags("User")
@Auth("SUPER_ADMIN")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: UsersResponse })
  @Get("")
  async get() {
    return await this.userService.getAllUsers();
  }

  @ApiResponse({ type: UserResponse })
  @Get(":id")
  async getUserDetail(@Param("id") id: string) {
    return await this.userService.findOneById(id);
  }

  @ApiResponse({ type: UserResponse })
  @Post("")
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create({
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
    });
  }

  @ApiResponse({ type: UserResponse })
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.userService.deleteUser(id);
  }

  @ApiResponse({ type: UserResponse })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
