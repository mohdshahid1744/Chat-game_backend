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
const MessageService_1 = __importDefault(require("../Service/MessageService"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, socketId, message } = req.body;
        console.log("ASFf", req.body);
        const response = yield MessageService_1.default.sendMessageService(chatId, socketId, message);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error sending chats", error);
    }
});
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const response = yield MessageService_1.default.getMessage(chatId);
        console.log("SADd", response);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error getting messages", error);
    }
});
exports.default = {
    sendMessage,
    getMessage
};
