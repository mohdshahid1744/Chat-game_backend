import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  participants: [string, string];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema<IChat> = new Schema({
  participants: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 2 participants'],
  },
}, { timestamps: true });

function arrayLimit(val: string[]) {
  return val.length === 2;
}

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);
export default ChatModel;
