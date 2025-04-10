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
const createChat = (user1, user2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingChat = yield ChatModel_1.default.findOne({
            "participants.username": { $all: [user1.socketId, user2.socketId] },
        });
        if (existingChat) {
            return {
                success: true,
                chatId: existingChat._id,
                message: "Chat already exists",
            };
        }
        const newChat = new ChatModel_1.default({
            participants: [user1, user2],
        });
        yield newChat.save();
        return {
            success: true,
            chatId: newChat._id,
            message: "New chat created",
        };
    }
    catch (err) {
        console.error(`Error creating chat: ${err}`);
        return { success: false, message: "Error creating chat" };
    }
});
const getChatsForUser = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield ChatModel_1.default.find({
            participants: { $elemMatch: { socketId } }
        }).sort({ updatedAt: -1 });
        return {
            success: true,
            chats,
        };
    }
    catch (err) {
        console.error(`Error fetching chats: ${err}`);
        return { success: false, message: "Error fetching chats" };
    }
});
exports.default = {
    createChat,
    getChatsForUser
};
