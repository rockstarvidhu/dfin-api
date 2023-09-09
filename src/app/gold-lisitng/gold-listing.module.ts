import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GoldListing, GoldListingSchema } from "./entities/gold-listing.entity";
import { GoldListingController } from "./gold-listing.controller";
import { GoldListingService } from "./gold-listing.service";
import { UserModule } from "../user/user.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GoldListing.name,
        schema: GoldListingSchema,
      },
    ]),
    UserModule,
    HttpModule
  ],

  controllers: [GoldListingController],
  providers: [GoldListingService],
  exports: [GoldListingService],
})
export class GoldListingModule {}
