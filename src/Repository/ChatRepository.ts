import ChatModel from "../Model/ChatModel";

const createChat = async (user1: string, user2: string) => {
  try {
    let existingChat = await ChatModel.findOne({
      participants: { $all: [user1, user2] },
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
const getChatsForUser = async (username: string) => {
    try {
        
        const chats = await ChatModel.find({
            participants: { $in: [new RegExp(`^${username}$`, "i")] }, 
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
    
