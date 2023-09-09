import { Body, Controller, Post, Get, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshDto } from "./dto/login.dto";
import { ReqUser } from "../user/entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { Auth, User } from "../../shared/decorators";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("/refresh-token")
  async refreshToken(@Body() token: RefreshDto) {
    return this.authService.refreshToken(token.refreshToken);
  }

  @Auth()
  @Delete("/logout")
  async logout(@User() user: ReqUser) {
    return this.authService.logout(user.sessionId);
  }

  @Auth("SUPER_ADMIN")
  @Get("/after-login")
  async afterLogin(@User() user: ReqUser) {
    return user;
  }
}
