import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MemberData } from 'src/types/member-data';

@Schema({
  versionKey: false
})
export class RoomMember {
  @Prop()
  roomId!: number;

  @Prop()
  members!: MemberData[];
}

export type RoomMemberDocument = RoomMember & Document;

export const RoomMemberSchema = SchemaFactory.createForClass(RoomMember);
