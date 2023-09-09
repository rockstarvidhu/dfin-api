import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GoldListingService } from "./gold-listing.service";

@ApiTags("Gold Listing")
@Controller("gold-listing")
export class GoldListingController {
  constructor(private readonly goldListingService: GoldListingService) { }

  @Get("list")
  getAllListings() {
    return this.goldListingService.getListings();
  }

}
