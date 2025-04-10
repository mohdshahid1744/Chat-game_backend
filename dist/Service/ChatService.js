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
const ChatRepository_1 = __importDefault(require("../Repository/ChatRepository"));
const createChat = (user1, user2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield ChatRepository_1.default.createChat(user1, user2);
        return response;
    }
    catch (err) {
        console.error("Error while creating chat", err);
    }
});
const getChat = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield ChatRepository_1.default.getChatsForUser(socketId);
        return response;
    }
    catch (err) {
        console.error("Error while getting chat", err);
        return { success: false, message: "Internal server error" };
    }
});
exports.default = {
    createChat,
    getChat
};
