import express from 'express';
import ChatController from '../../Controller/ChatController';
import MessageController from '../../Controller/MessageController';
const router = express.Router();
router.post('/chat', ChatController.createChat); 
router.get('/chatList/:username',ChatController.getChat)
router.post('/sendmessage',MessageController.sendMessage)
router.get('/getmessage/:chatId', MessageController.getMessage)


export default router;
  