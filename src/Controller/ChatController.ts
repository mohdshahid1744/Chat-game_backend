import { Request, Response } from "express";
import ChatService from "../Service/ChatService";

const createChat=async (req:Request,res:Response)=>{
    const {user1,user2}=req.body
    try {
        const response=await ChatService.createChat(user1,user2)
        res.status(200).json(response)
    } catch (error) {
        console.error("Error sending chats",error); 
    }
}

const getChat=async (req:Request,res:Response)=>{
    const {socketId}=req.params
    try {
        const response=await ChatService.getChat(socketId)
        res.status(200).json(response)
    } catch (error) {
        console.error("Error getting chats",error);  
    }
}

export default{
    createChat,
    getChat
} 
