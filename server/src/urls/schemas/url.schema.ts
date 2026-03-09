import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrlDocument = ShortUrl & Document;

@Schema({ timestamps: true })
export class ShortUrl {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  longUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ type: [{ name: String, color: String }], default: [] })
  tags: { name: string; color: string }[];
}

export const UrlSchema = SchemaFactory.createForClass(ShortUrl);
