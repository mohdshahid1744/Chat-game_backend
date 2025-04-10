import MessageRespository from "../Repository/MessageRespository";
const sendMessageService = async (chatId: string, socketId: string, message: string) => {
    try {
      if (!message?.trim()) {
        throw new Error("Message cannot be empty");
      }
  
      const sentMessage = await MessageRespository.sendMessage(chatId, socketId, message);
      return sentMessage;
  
    } catch (error) {
      console.error("Error in sendMessageService:", error);
      throw error; 
    }
  };
  
const getMessage=async(chatId:string)=>{
    try {
        let response = await MessageRespository.getMessage(chatId)
        return response
    } catch (err) {
        console.error("Error while getting message", err)
    }
}

export default {
  sendMessageService,
  getMessage
};
