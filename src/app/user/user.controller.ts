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
import { ApiTags } from "@nestjs/swagger";
import { createUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "./dto/update-user.dto";

@ApiTags("User")
@Auth("SUPER_ADMIN")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("")
  async get() {
    return await this.userService.getAllUsers();
  }

  @Get(":id")
  async getUserDetail(@Param("id") id: string) {
    return await this.userService.findOneById(id);
  }

  @Post("")
  async create(@Body() user: createUserDto) {
    await this.userService.create({
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
      status: "ACTIVE",
    });
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.userService.deleteUser(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: Partial<updateUserDto>
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }
}
