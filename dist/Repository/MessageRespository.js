"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatModel_1 = __importDefault(require("../Model/ChatModel"));
const MessageModel_1 = __importDefault(require("../Model/MessageModel"));
const sendMessage = (chatId, socketId, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield ChatModel_1.default.findById(chatId);
        console.log("Chat fetched:", chat);
        console.log("Username:", socketId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        // ✅ Check if the username is in the participants
        const isParticipant = chat.participants.some(p => p.socketId === socketId);
        console.log("partyyyyy", isParticipant);
        if (!isParticipant) {
            console.log("Participants in chat:", chat.participants);
            throw new Error("Sender is not part of the chat");
        }
        // ✅ Find the other participant
        const receiverObj = chat.participants.find(p => p.socketId !== socketId);
        if (!receiverObj) {
            throw new Error("Receiver could not be determined");
        }
        const receiver = receiverObj.username;
        const newMessage = yield MessageModel_1.default.create({
            chat: chatId,
            sender: socketId,
            receiver,
            message,
        });
        return newMessage;
    }
    catch (error) {
        throw new Error(error.message || "Failed to send message");
    }
});
const getMessage = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let messages = yield MessageModel_1.default.find({ chat: chatId }).sort({ createdAt: 1 });
        return { messages };
    }
    catch (err) {
        console.error("Error while getting messages", err);
        return null;
    }
});
exports.default = {
    sendMessage,
    getMessage
};
