import ChatModel from "../Model/ChatModel"; 
import MessageModel from "../Model/MessageModel";

const sendMessage = async (chatId: string, socketId: string, message: string) => {
    try {
      const chat = await ChatModel.findById(chatId);
      console.log("Chat fetched:", chat);
      console.log("Username:", socketId);
  
      if (!chat) {
        throw new Error("Chat not found");
      }
  
      // ✅ Check if the username is in the participants
      const isParticipant = chat.participants.some(p => p.socketId === socketId);
      console.log("partyyyyy",isParticipant);
      
      if (!isParticipant) {
        console.log("Participants in chat:", chat.participants);
        throw new Error("Sender is not part of the chat");
      }
  
      // ✅ Find the other participant
      const receiverObj = chat.participants.find(p => p.socketId !== socketId);
      if (!receiverObj) {
        throw new Error("Receiver could not be determined");
      }
  
      const receiver = receiverObj.username;
  
      const newMessage = await MessageModel.create({
        chat: chatId,
        sender: socketId,
        receiver,
        message,
      });
  
      return newMessage;
    } catch (error: any) {
      throw new Error(error.message || "Failed to send message");
    }
  };
  
const getMessage = async (chatId: string) => {
    try {
        let messages = await MessageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        
        return { messages };
    } catch (err) {
        console.error("Error while getting messages", err);
        return null;
    }
};
export default{
    sendMessage,
    getMessage
} 
