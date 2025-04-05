import mongoose, { Document, Schema } from "mongoose";
export interface IMessage extends Document {
    chat: string;
    sender: string;
    receiver: string;
    message?: string;
    createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    chat: { type: String, },
    sender: { type: String, },
    message: { type: String },

}, { timestamps: true });

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;