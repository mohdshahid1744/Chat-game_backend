import mongoose, { Document, Schema } from "mongoose";

interface Participant {
  username: string;
  socketId: string;
}

export interface IChat extends Document {
  participants: [Participant, Participant];
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<Participant>({
  username: { type: String, required: true },
  socketId: { type: String, required: true },
});

const chatSchema: Schema<IChat> = new Schema(
  {
    participants: {
      type: [participantSchema],
      validate: [arrayLimit,],
      required: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(val: Participant[]) {
  return val.length === 2;
}

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);
export default ChatModel;

