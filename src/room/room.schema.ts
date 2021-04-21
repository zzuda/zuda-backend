import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RoomMember {
  @Prop()
  roomId!: number;

  @Prop()
  members!: string[];
}

export type RoomMemberDocument = RoomMember & Document;

export const RoomMemberSchema = SchemaFactory.createForClass(RoomMember);
