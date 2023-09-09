import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Observable, catchError, map } from "rxjs";
import { updatePercentDto } from "./dto/rates.dto";
import {
  RateAdjustments,
  RateAdjustmentsDocument,
} from "./entities/rate.entity";
import { Model } from "mongoose";
import { ReqUser } from "../user/entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { GOLD_API } from "src/config";

@Injectable()
export class MetalRateService {
  constructor(
    private userService: UserService,
    private readonly httpService: HttpService,
    @InjectModel(RateAdjustments.name)
    private rateAdjustments: Model<RateAdjustments>
  ) {}

  /**
   *  create user
   * @param user
   * @returns  Promise<Post>
   */

  async getLiveRate(userId: string): Promise<Object> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new Error("Invalid User");
    }

    const ratePercents = await this.rateAdjustments.findOne({
      user: user,
    });

    if (!ratePercents) {
      throw new Error("Percents haven't set yet");
    }

    const percentageChange = ratePercents.percentageChange / 100;

    const headers = {
      "x-access-token": GOLD_API.GOLD_API_TOKEN,
    };

    try {
      const apiUrlUSD = `${GOLD_API.GOLD_API_URL}/XAU/USD`;
      const rateDataUSD: any = await this.fetchMetalRate(apiUrlUSD, headers);

      const updatedLiveGoldRate = {
        buy: parseFloat((rateDataUSD.bid * (1 + percentageChange)).toFixed(2)),
        sell: parseFloat((rateDataUSD.ask * (1 - percentageChange)).toFixed(2)),
        high_price: parseFloat(
          (rateDataUSD.high_price * (1 - percentageChange)).toFixed(2)
        ),
        low_price: parseFloat(
          (rateDataUSD.low_price * (1 - percentageChange)).toFixed(2)
        ),
      };

      // Do something with metalRates object, which contains rates for different metals
      return updatedLiveGoldRate;
    } catch (error) {
      // Handle errors here
      throw error;
    }
  }

  async adjustRate(
    user: ReqUser,
    ratePercents: updatePercentDto
  ): Promise<RateAdjustments> {
    const updatedBy = await this.userService.findOneByEmail(user.email);

    // Check if a rate adjustment collection already exists for the user
    let existingAdjustments = await this.rateAdjustments.findOne({
      user: updatedBy,
    });

    if (!existingAdjustments) {
      // If no existing rate adjustment collection is found, create a new one
      existingAdjustments = new this.rateAdjustments({
        ...ratePercents, // Use the provided adjustments
        user: updatedBy,
      });
    } else {
      // If an existing collection is found, update it with the new adjustments
      Object.assign(existingAdjustments, ratePercents);
    }
    // Save the updated or new rate adjustments
    return await existingAdjustments.save();
  }

  async fetchMetalRate(apiUrl: string, headers: Record<string, string>) {
    try {
      const response: AxiosResponse<Object[]> = await this.httpService
        .get(apiUrl, { headers })
        .toPromise();

      return response.data;
    } catch (error) {
      // Handle errors here
      throw error;
    }
  }
  async calculateUpdatedMetalRate(rateDataAED: any, ratePercents: any) {
    const percentageChange = ratePercents.percentageChange / 100;
    const updatedGoldRate = {
      //update later based on percent

      price_gram_24k_AED: parseFloat(
        (rateDataAED.price_gram_24k * (1 + percentageChange)).toFixed(2)
      ),
    };

    return updatedGoldRate;
  }

  /**
   *  get live rate
   */

  async getRates(userId: string): Promise<Object> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new Error("Invalid User");
    }

    const ratePercents = await this.rateAdjustments.findOne({
      user: user,
    });

    if (!ratePercents) {
      throw new Error("Percents haven't set yet");
    }

    const headers = {
      "x-access-token": `goldapi-5j88rlmaby265-io`,
    };

    const metals = [
      { name: "Gold", symbol: "XAU" },
      { name: "Silver", symbol: "XAG" },
      { name: "Platinum", symbol: "XPT" },
      { name: "Palladium", symbol: "XPD" },
    ]; // Add more metals as needed

    try {
      const metalRates = [];

      for (const metal of metals) {
        const apiUrlAED = `${GOLD_API.GOLD_API_URL}/${metal.symbol}/AED`;
        const rateDataAED = await this.fetchMetalRate(apiUrlAED, headers);

        const updatedMetalRate = await this.calculateUpdatedMetalRate(
          rateDataAED,
          ratePercents
        );
        const metalRate = {
          name: metal.name,
          symbol: metal.symbol,
          ...updatedMetalRate,
        };
        metalRates.push(metalRate);
      }

      return metalRates;
    } catch (error) {
      // Handle errors here
      console.log(error);
      throw error;
    }
  }
}
