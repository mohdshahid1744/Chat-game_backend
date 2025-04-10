"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./src/Framework/Database/db"));
const socket_io_1 = require("socket.io");
const Socket_1 = __importDefault(require("./src/Utils/Socket"));
const ChatRoute_1 = __importDefault(require("./src/Framework/Routes/ChatRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3001;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', ChatRoute_1.default);
(0, Socket_1.default)(io);
db_1.default.once('open', () => {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
