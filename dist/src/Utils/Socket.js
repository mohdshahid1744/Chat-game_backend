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
const players = {};
const configureSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`Player ${socket.id} connected`);
        socket.on("playerJoined", (playerData) => {
            players[socket.id] = playerData;
            io.emit("updatePlayers", players);
        });
        socket.on("chat created", (data) => {
            console.log("Chat created between:", data.user1, "and", data.user2);
            io.emit("chat list update", data);
        });
        socket.on("playerMoved", (playerData) => {
            if (players[socket.id]) {
                players[socket.id] = playerData;
                io.emit("updatePlayers", players);
            }
        });
        socket.on('join chat', (room) => {
            socket.join(room);
            console.log("Joined room:", room);
        });
        socket.on('new message', (newMessageReceived) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("RECEIVED", newMessageReceived);
            if (!newMessageReceived || !newMessageReceived.sender) {
                console.error("Invalid new message structure:", newMessageReceived);
                return;
            }
            socket.to(newMessageReceived.chat).emit("message received", newMessageReceived);
            io.emit("sortChatlist", newMessageReceived);
        }));
        socket.on("delete message", (messageId, chatId) => {
            console.log("Deleting message:", messageId);
            console.log("Deleting chat:", chatId);
            socket.to(chatId).emit("message deleted", messageId);
        });
        socket.on("end chat", (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, opponentPlayerId }) {
            const player = players[socket.id];
            if (!player)
                return;
            const opponentSocketId = Object.keys(players).find(key => players[key].id === opponentPlayerId);
            console.log("Resolved opponentSocketId:", opponentSocketId);
            try {
                yield ChatModel_1.default.deleteOne({ _id: chatId });
                yield MessageModel_1.default.deleteMany({ chat: chatId });
                if (opponentSocketId && players[opponentSocketId]) {
                    io.to(opponentSocketId).emit("chat ended", {
                        chatId,
                        message: `${player.name} ended the chat.`,
                        endedBy: player.id,
                    });
                    setTimeout(() => {
                        io.to(opponentSocketId).emit("chat list update", {
                            user1: player.id,
                            user2: opponentPlayerId,
                            reason: "chat ended",
                            message: `${player.name} ended the chat.`,
                        });
                    }, 3000);
                }
                io.to(socket.id).emit("chat ended", {
                    chatId,
                    message: `You ended the chat.`,
                    endedBy: player.id,
                });
            }
            catch (err) {
                console.error("Error ending chat:", err);
            }
        }));
        socket.on("playerLeft", () => __awaiter(void 0, void 0, void 0, function* () {
            const player = players[socket.id];
            console.log(`Player ${socket.id} (${player === null || player === void 0 ? void 0 : player.name}) quit`);
            delete players[socket.id];
            io.emit("updatePlayers", players);
            if ((player === null || player === void 0 ? void 0 : player.id) && (player === null || player === void 0 ? void 0 : player.name)) {
                try {
                    const chatsToDelete = yield ChatModel_1.default.find({ "participants.socketId": player.id });
                    const chatIds = chatsToDelete.map(chat => chat._id);
                    const chatRes = yield ChatModel_1.default.deleteMany({ _id: { $in: chatIds } });
                    const messageRes = yield MessageModel_1.default.deleteMany({ chat: { $in: chatIds } });
                    const senderRes = yield MessageModel_1.default.deleteMany({ sender: player.id });
                    console.log(`Deleted ${chatRes.deletedCount} chat(s), ${messageRes.deletedCount} message(s), ${senderRes.deletedCount} from ${player.id}`);
                    for (const chat of chatsToDelete) {
                        const opponent = chat.participants.find(p => p.socketId !== player.id);
                        const opponentSocketId = Object.keys(players).find(key => players[key].id === (opponent === null || opponent === void 0 ? void 0 : opponent.socketId));
                        if (opponentSocketId) {
                            io.to(opponentSocketId).emit("chat list update", {
                                user1: player.id,
                                user2: opponent === null || opponent === void 0 ? void 0 : opponent.socketId,
                            });
                            io.to(opponentSocketId).emit("opponentLeft", {
                                opponent: player.id,
                                message: `${player.name} has left the chat.`,
                            });
                        }
                    }
                    io.to(socket.id).emit("chat list update", {
                        user1: player.id,
                        user2: null,
                        reason: "player left",
                    });
                }
                catch (err) {
                    console.error("Error deleting player data:", err);
                }
            }
        }));
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Player ${socket.id} disconnected`);
            const player = players[socket.id];
            delete players[socket.id];
            io.emit("updatePlayers", players);
            if ((player === null || player === void 0 ? void 0 : player.id) && (player === null || player === void 0 ? void 0 : player.name)) {
                try {
                    const chatsToDelete = yield ChatModel_1.default.find({ "participants.socketId": player.id });
                    const chatIds = chatsToDelete.map(chat => chat._id);
                    const chatRes = yield ChatModel_1.default.deleteMany({ _id: { $in: chatIds } });
                    const messageRes = yield MessageModel_1.default.deleteMany({ chat: { $in: chatIds } });
                    const senderRes = yield MessageModel_1.default.deleteMany({ sender: player.id });
                    console.log(`Deleted ${chatRes.deletedCount} chat(s), ${messageRes.deletedCount} message(s), ${senderRes.deletedCount} from ${player.name}`);
                    for (const chat of chatsToDelete) {
                        const opponent = chat.participants.find(p => p.socketId !== player.id);
                        const opponentSocketId = Object.keys(players).find(key => players[key].id === (opponent === null || opponent === void 0 ? void 0 : opponent.socketId));
                        if (opponentSocketId) {
                            io.to(opponentSocketId).emit("chat list update", {
                                user1: player.id,
                                user2: opponent === null || opponent === void 0 ? void 0 : opponent.socketId,
                            });
                            io.to(opponentSocketId).emit("opponentLeft", {
                                opponent: player.id,
                                message: `${player.name} has left the chat.`,
                            });
                        }
                    }
                    io.to(socket.id).emit("chat list update", {
                        user1: player.id,
                        user2: null,
                        reason: "player left",
                    });
                }
                catch (err) {
                    console.error("Error deleting player data:", err);
                }
            }
        }));
    });
};
exports.default = configureSocket;
