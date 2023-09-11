import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AppBuildLog, AppGenDocument } from "./entities/appgen.entity";
import { ReqUser } from "../user/entities/user.entity";
import { BuildAppDto } from "./dto/appgen.dto.";
import { UserService } from "../user/user.service";

@Injectable()
export class AppGenService {
  constructor(
    @InjectModel(AppBuildLog.name)
    private post: Model<AppGenDocument>,
    private userService: UserService
  ) {}

  /**
   *  create user
   * @param user
   * @returns  Promise<Post>
   */

  async build(user: ReqUser, appGenData: BuildAppDto): Promise<AppBuildLog> {
    const postedBy = await this.userService.findOneByEmail(user.email);
    const createdLog = new this.post({
      ...appGenData,
      user: postedBy,
    });
    return await createdLog.save();
  }
}
