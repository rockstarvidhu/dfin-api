import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaType } from 'mongoose';
import { Status, StatusType } from 'src/shared/types';
import { User } from 'src/app/user/entities/user.entity';

export type SessionDataDocument = HydratedDocument<SessionData>;

@Schema({
  timestamps: true,
})
export class SessionData {
  @Prop({ type: SchemaType.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: false })
  ip: string;

  @Prop({ required: false })
  device: string;

  @Prop({
    type: String,
    enum: Status,
    default: Status.ACTIVE,
  })
  status: StatusType;
}

export const SessionDataSchema = SchemaFactory.createForClass(SessionData);
