import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppGenLog, AppGenSchema } from "./entities/appgen.entity";
import { AppGenController } from "./appgen.controller";
import { AppGenService } from "./appgen.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AppGenLog.name,
        schema: AppGenSchema,
      },
    ]),
    UserModule,
  ],

  controllers: [AppGenController],
  providers: [AppGenService],
  exports: [AppGenService],
})
export class AppGenModule {}
