import ChatRepository from "../Repository/ChatRepository"

const createChat = async (user1: { username: string; socketId: string }, user2: { username: string; socketId: string }) => {
    try {
      const response = await ChatRepository.createChat(user1, user2);
      return response;
    } catch (err) {
      console.error("Error while creating chat", err);
    }
  };
  
  const getChat = async (socketId: string) => {
    try {
      const response = await ChatRepository.getChatsForUser(socketId);
      return response;
    } catch (err) {
      console.error("Error while getting chat", err);
      return { success: false, message: "Internal server error" };
    }
  };
  
export default{
    createChat,
    getChat
}