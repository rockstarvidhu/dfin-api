import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as SchemaType } from "mongoose";
import { User } from "../../user/entities/user.entity";

export type AppGenDocument = HydratedDocument<AppBuildLog>;

@Schema({
  timestamps: true,
})
export class AppBuildLog {
  @Prop({ type: SchemaType.Types.ObjectId, ref: "User", required: true })
  user!: User;

  @Prop({ required: true })
  backgroundColor!: string;

  @Prop({ required: true })
  backgroundImage!: string;
}

export const AppGenSchema = SchemaFactory.createForClass(AppBuildLog);
