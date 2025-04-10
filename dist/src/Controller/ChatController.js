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
const ChatService_1 = __importDefault(require("../Service/ChatService"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2 } = req.body;
    try {
        const response = yield ChatService_1.default.createChat(user1, user2);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error sending chats", error);
    }
});
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { socketId } = req.params;
    try {
        const response = yield ChatService_1.default.getChat(socketId);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error getting chats", error);
    }
});
exports.default = {
    createChat,
    getChat
};
