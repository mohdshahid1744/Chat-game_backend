import ChatModel from "../Model/ChatModel";

const createChat = async (
    user1: { username: string; socketId: string },
    user2: { username: string; socketId: string }
  ) => {
    try {
      const existingChat = await ChatModel.findOne({
        "participants.username": { $all: [user1.socketId, user2.socketId] },
      });
  
      if (existingChat) {
        return {
          success: true,
          chatId: existingChat._id,
          message: "Chat already exists",
        };
      }
  
      const newChat = new ChatModel({
        participants: [user1, user2],
      });
  
      await newChat.save();
  
      return {
        success: true,
        chatId: newChat._id,
        message: "New chat created",
      };
    } catch (err) {
      console.error(`Error creating chat: ${err}`);
      return { success: false, message: "Error creating chat" };
    }
  };
  
  const getChatsForUser = async (socketId: string) => {
    try {
      const chats = await ChatModel.find({
        participants: { $elemMatch: { socketId } }
      }).sort({ updatedAt: -1 });
  
      return {
        success: true,
        chats,
      };
    } catch (err) {
      console.error(`Error fetching chats: ${err}`);
      return { success: false, message: "Error fetching chats" };
    }
  };
  
  
  
  
export default{
    createChat,
    getChatsForUser
} 
    
