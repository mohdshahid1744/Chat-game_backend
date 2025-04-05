import { Request, Response } from "express";
import messageService from "../Service/MessageService";

const sendMessage = async (req: Request, res: Response) => {
try {
    const { chatId, username, message } = req.body;
    console.log("ASFf",req.body);
    
    const response = await messageService.sendMessageService(chatId, username, message);
     res.status(200).json(response);
} catch (error) {
    console.error("Error sending chats",error); 
}
};
const getMessage=async(req:Request,res:Response)=>{
    const {chatId}=req.params
try {
    const response=await messageService.getMessage(chatId)
    console.log("SADd",response);
    
    res.status(200).json(response)
} catch (error) {
   console.error("Error getting messages",error);
    
}
}

export default{
    sendMessage,
    getMessage
}

