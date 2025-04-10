"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURL = process.env.Mongo_URL || "";
mongoose_1.default.connect(mongoURL);
const db = mongoose_1.default.connection;
db.once("open", () => {
    console.log("MongoDB connected successfully");
});
db.on("error", (err) => {
    console.error("Error connecting MongoDB:", err);
});
exports.default = db;
