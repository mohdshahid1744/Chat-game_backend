import ChatModel from "../Model/ChatModel"; 
import MessageModel from "../Model/MessageModel";

const sendMessage = async (chatId: string, username: string, message: string) => {
  try {
    const chat = await ChatModel.findById(chatId);
    console.log("Chat fetched:", chat);
console.log("Username:", username);
    if (!chat) {
      throw new Error("Chat not found");
    }

    if (!chat.participants.includes(username)) {
        console.log("Participants in chat:", chat.participants);
        throw new Error("Sender is not part of the chat");
      }

    const receiver = chat.participants.find(participant => participant !== username);
    if (!receiver) {
      throw new Error("Receiver could not be determined");
    }

    const newMessage = await MessageModel.create({
      chat: chatId,
      sender: username,
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
