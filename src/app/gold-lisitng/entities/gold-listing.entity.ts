import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaType } from "mongoose";
import { User } from "src/app/user/entities/user.entity";

export type GoldListingDocument = HydratedDocument<GoldListing>;

@Schema({
  timestamps: true,
})
export class GoldListing {
  @Prop({ type: SchemaType.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}

export const GoldListingSchema = SchemaFactory.createForClass(GoldListing);
