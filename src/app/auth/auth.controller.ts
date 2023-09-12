import { Body, Controller, Post, Get, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshDto } from "./dto/login.dto";
import { ReqUser } from "../user/entities/user.entity";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Auth, User } from "../../shared/decorators";
import { TokenResponse } from "./types/auth.response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    type: TokenResponse,
  })
  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiResponse({
    type: TokenResponse,
  })
  @Post("/refresh-token")
  async refreshToken(@Body() token: RefreshDto) {
    return this.authService.refreshToken(token.refreshToken);
  }
  @ApiResponse({ status: 200 })
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
