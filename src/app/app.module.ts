import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserModule } from "./user/user.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "../shared/filters";
import { APP, DB } from "../config";
import { HttpLoggerMiddleware } from "@nest-toolbox/http-logger-middleware";
import { AuthModule } from "./auth/auth.module";
import { AppGenModule } from "./appgen/appgen.module";
import { GoldListingModule } from "./gold-lisitng/gold-listing.module";
import { MetalRatesModule } from "./rates/rates.module";
@Module({
  imports: [
    MongooseModule.forRoot(DB.HOST_URL, { dbName: DB.NAME }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    UserModule,
    MetalRatesModule,
    AppGenModule,
    GoldListingModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    if (APP.NODE_ENV !== "production") {
      consumer.apply(HttpLoggerMiddleware).forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
    }
  }
}
