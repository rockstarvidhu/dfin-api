import { Body, Controller, Post } from "@nestjs/common";
import { Auth } from "../../shared/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";
import { ReqUser } from "../user/entities/user.entity";
import { BuildAppDto } from "./dto/appgen.dto.";
import { AppGenService } from "./appgen.service";
import { User } from "../../shared/decorators";

@ApiTags("AppBuild")
@Controller("app-build")
export class AppGenController {
  constructor(private readonly appGenService: AppGenService) {}

  @Auth("USER_ADMIN", "SUPER_ADMIN")
  @Post("build")
  async create(@User() user: ReqUser, @Body() appGenData: BuildAppDto) {
    await this.appGenService.build(user, appGenData);
  }
}
