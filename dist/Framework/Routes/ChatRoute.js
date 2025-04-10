"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = __importDefault(require("../../Controller/ChatController"));
const MessageController_1 = __importDefault(require("../../Controller/MessageController"));
const router = express_1.default.Router();
router.post('/chat', ChatController_1.default.createChat);
router.get('/chatList/:socketId', ChatController_1.default.getChat);
router.post('/sendmessage', MessageController_1.default.sendMessage);
router.get('/getmessage/:chatId', MessageController_1.default.getMessage);
exports.default = router;
