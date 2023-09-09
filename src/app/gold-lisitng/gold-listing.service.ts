import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  GoldListing,
  GoldListingDocument,
} from "./entities/gold-listing.entity";
import { ReqUser } from "../user/entities/user.entity";
import { CreateListingDto } from "./dto/gold-listing.dto";
import { UserService } from "../user/user.service";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Observable, catchError, map } from "rxjs";

@Injectable()
export class GoldListingService {
  constructor(
    @InjectModel(GoldListing.name)
    private goldListing: Model<GoldListingDocument>,
    private userService: UserService,
    private readonly httpService: HttpService
  ) { }

  /**
   *  create user
   * @param user
   * @returns  Promise<Post>
   */

  getListings(): Observable<AxiosResponse<GoldListing[]>> {
    const apiUrl = 'https://www.goldapi.io/api/XAU/USD';
    const headers = {
      'x-access-token': 'goldapi-5kxrlm0a40ll-io',
    };
    return this.httpService.get(apiUrl, { headers }).pipe(
      map(response => response.data), // Extract only the data
      catchError(error => (error))
    );


  }


}
