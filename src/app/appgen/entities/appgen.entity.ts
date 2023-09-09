import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaType } from "mongoose";
import { User } from "src/app/user/entities/user.entity";

export type AppGenDocument = HydratedDocument<AppGenLog>;

@Schema({
  timestamps: true,
})
export class AppGenLog {
  @Prop({ type: SchemaType.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ required: true })
  background_color: string;

  @Prop({ required: true })
  background_image: string;
}

export const AppGenSchema = SchemaFactory.createForClass(AppGenLog);
