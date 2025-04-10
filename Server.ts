import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './src/Framework/Database/db';
import { Server as SocketIOServer } from "socket.io";
import configureSocket from './src/Utils/Socket'
import ChatRouter from './src/Framework/Routes/ChatRoute'



dotenv.config();
const app = express();
const port = 3001;

const server = http.createServer(app); 
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/', ChatRouter);
configureSocket(io);
db.once('open', () => {
  
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});