import ChatRepository from "../Repository/ChatRepository"

const createChat=async(user1:string,user2:string)=>{
    try {
        const response=await ChatRepository.createChat(user1,user2)
        return response
    } catch (err) {
        console.error("Error while creating chat", err)
    }
}
const getChat = async(username:string)=>{
    try {
        const response=await ChatRepository.getChatsForUser(username)
        return response
    }catch (err) {
        console.error("Error while get chat", err)
    }
}
export default{
    createChat,
    getChat
}