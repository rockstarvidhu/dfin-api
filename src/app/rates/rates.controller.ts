import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Sse,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MetalRateService } from "./rates.servie";
import { updatePercentDto } from "./dto/rates.dto";
import { Auth, User } from "src/shared/decorators";
import { ReqUser } from "../user/entities/user.entity";
import { Observable, catchError, interval, map, switchMap } from "rxjs";

@ApiTags("Metal Rates")
@Controller("rates")
export class RatesController {
  constructor(private readonly metalRateService: MetalRateService) {}

  @Get("")
  getAllListings(@Headers() headers: Object) {
    // Access headers here
    const userId = headers["user-id"];
    // console.log(userId, "user id");
    return this.metalRateService.getRates(userId);
  }

  // @Get("liveRates")
  // getLiveRates(@Headers() headers: Object) {
  //   // Access headers here
  //   const userId = headers["user-id"];
  //   return this.metalRateService.getLiveRate(userId);
  // }

  @Auth("USER_ADMIN")
  @Post("rateAdjustments")
  updatePercent(@User() user: ReqUser, @Body() ratePercents: updatePercentDto) {
    this.metalRateService.adjustRate(user, ratePercents);
  }

  @Sse("liveRates")
  getLiveRates(@Query("user-id") userId: string): Observable<MessageEvent> {
    console.log(userId);
    return interval(10000).pipe(
      switchMap(() => this.metalRateService.getLiveRate(userId)),
      map((data) => {
        console.log("Received data from metalRateService:", data);
        return { data } as MessageEvent;
      }),
      catchError((error) => {
        console.error("Error:", error);
        throw error; // Rethrow the error to propagate it to the client
      })
    );
  }
}
