import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// SCHEMAS
import { User } from './users.schema';

@Schema()
export class Email extends Document {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, default: false })
  trash: boolean;

  @Prop({ required: true, default: false })
  read: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  from: User | Types.ObjectId;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
