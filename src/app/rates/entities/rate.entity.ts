import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaType } from "mongoose";
import { User } from "../../user/entities/user.entity";

export type RateAdjustmentsDocument = HydratedDocument<RateAdjustments>;

@Schema({
  timestamps: true,
})
export class RateAdjustments {
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  })
  user!: User;

  @Prop({ required: true })
  percentageChange!: number;
}

export const RateAdjustmentsSchema =
  SchemaFactory.createForClass(RateAdjustments);
