import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { HttpModule } from "@nestjs/axios";
import { RatesController } from "./rates.controller";
import { MetalRateService } from "./rates.servie";
import { MongooseModule } from "@nestjs/mongoose";
import { RateAdjustments, RateAdjustmentsSchema } from "./entities/rate.entity";

@Module({
  imports: [
    UserModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: RateAdjustments.name,
        schema: RateAdjustmentsSchema,
      },
    ]),
  ],

  controllers: [RatesController],
  providers: [MetalRateService],
  exports: [MetalRateService],
})
export class MetalRatesModule {}
