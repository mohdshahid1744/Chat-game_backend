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
const MessageRespository_1 = __importDefault(require("../Repository/MessageRespository"));
const sendMessageService = (chatId, socketId, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(message === null || message === void 0 ? void 0 : message.trim())) {
            throw new Error("Message cannot be empty");
        }
        const sentMessage = yield MessageRespository_1.default.sendMessage(chatId, socketId, message);
        return sentMessage;
    }
    catch (error) {
        console.error("Error in sendMessageService:", error);
        throw error;
    }
});
const getMessage = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield MessageRespository_1.default.getMessage(chatId);
        return response;
    }
    catch (err) {
        console.error("Error while getting message", err);
    }
});
exports.default = {
    sendMessageService,
    getMessage
};
