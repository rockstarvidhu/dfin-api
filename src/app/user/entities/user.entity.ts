import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role, RoleType, Status, StatusType } from "src/shared/types";

export type UserDocument = HydratedDocument<User>;
export type WarpedUser = Omit<User, "passwordHash">;

export type ReqUser = Omit<
  WarpedUser,
  "name" | "status" | "settings" | "pricePercentage"
> & {
  sessionId: string;
};
export type NewUser = { password: string } & Omit<
  User,
  "passwordHash" | "settings" | "pricePercentage"
>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: String,
    enum: Status,
    default: Status.ACTIVE,
  })
  status: StatusType;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER_ADMIN,
  })
  role: RoleType;

  @Prop({ type: Object, default: {}, required: false })
  settings: Record<string, any>;

  @Prop({ required: false })
  pricePercentage: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.password;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});
