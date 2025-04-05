import { Server, Socket } from "socket.io";
import Chat from "../Model/ChatModel";
import Message from "../Model/MessageModel";
interface PlayerData {
    id: string; 
    name: string;
    x: number;
    y: number;
  }

  const players: Record<string, PlayerData> = {};

const configureSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Player ${socket.id} connected`);

    socket.on("playerJoined", (playerData) => {
      players[socket.id] = playerData;
      io.emit("updatePlayers", players);
    });
    socket.on("chat created", (data) => {
        console.log("Chat created between:", data.user1, "and", data.user2);
      
        io.emit("chat list update", data);
      });
      
    socket.on("playerMoved", (playerData) => {
      if (players[socket.id]) {
        players[socket.id] = playerData;
        io.emit("updatePlayers", players);
      }
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("Joined room:", room);
      });
      socket.on('new message', async (newMessageReceived) => {
        console.log("RECEIVED", newMessageReceived);
        
        if (!newMessageReceived || !newMessageReceived.sender) {
            console.error("Invalid new message structure:", newMessageReceived);
            return;
        }
        socket.to(newMessageReceived.chat).emit("message received", newMessageReceived);
        io.emit("sortChatlist", newMessageReceived);
      });
      socket.on("delete message", (messageId, chatId) => {
        console.log("Deleting message:", messageId);
        console.log("Deleting chat:", chatId);
        socket.to(chatId).emit("message deleted", messageId);
      });
      socket.on("end chat", async ({ chatId, opponent }) => {
        const player = players[socket.id];
        if (!player) return;
      
        try {
          const chatRes = await Chat.deleteOne({ _id: chatId });
          const messageRes = await Message.deleteMany({ chat: chatId });
      
          console.log(
            `Chat ${chatId} ended by ${player.name}. Deleted ${chatRes.deletedCount} chat, ${messageRes.deletedCount} messages.`
          );
      
          const opponentSocketId = Object.keys(players).find(
            key => players[key].name === opponent
          );
      
          if (opponentSocketId) {
            io.to(opponentSocketId).emit("chat list update", {
              user1: player.name,
              user2: opponent,
              reason: "chat ended",
              message: `${player.name} ended the chat.`,
            });
          
            io.to(opponentSocketId).emit("chat ended", {
              chatId,
              message: `${player.name} ended the chat.`,
              endedBy: player.name,
            });
          }
          
          io.to(socket.id).emit("chat ended", {
            chatId,
            message: `You ended the chat with ${opponent}.`,
            endedBy: player.name,
          });
          
      
        } catch (error) {
          console.error("Error ending chat:", error);
          io.to(socket.id).emit("error", {
            message: "Failed to end chat. Try again later.",
          });
        }
      });
      

      socket.on("playerLeft", async () => {
        const player = players[socket.id];
        console.log(`Player ${socket.id} (${player?.name}) quit`);
      
        delete players[socket.id];
        io.emit("updatePlayers", players);
      
        if (player?.id && player?.name) {
          try {
            const chatsToDelete = await Chat.find({ participants: player.name });
            const chatIds = chatsToDelete.map(chat => chat._id);
      
            const chatRes = await Chat.deleteMany({ _id: { $in: chatIds } });
            const messageRes = await Message.deleteMany({ chat: { $in: chatIds } });
            const senderRes = await Message.deleteMany({ sender: player.id });
      
            console.log(
              `Deleted ${chatRes.deletedCount} chat(s), ${messageRes.deletedCount} message(s), ${senderRes.deletedCount} from ${player.name}`
            );
      
            for (const chat of chatsToDelete) {
              const opponent = chat.participants.find(p => p !== player.name);
      
              const opponentSocketId = Object.keys(players).find(
                key => players[key].name === opponent
              );
      
              if (opponentSocketId) {
                io.to(opponentSocketId).emit("chat list update", {
                  user1: player.name,
                  user2: opponent,
                });
                io.to(opponentSocketId).emit("opponentLeft", {
                    opponent: player.name,
                    message: `${player.name} has left the chat.`,
                  });
              }
            }
      
            io.to(socket.id).emit("chat list update", {
                user1: player.name,
                user2: null,
                reason: "player left",
              });
              
      
          } catch (err) {
            console.error("Error deleting player data:", err);
          }
        }
      });
      
      
      
      
      

      socket.on("disconnect", async () => {
        console.log(`Player ${socket.id} disconnected`);
      
        const player = players[socket.id];
        delete players[socket.id];
        io.emit("updatePlayers", players);
      
        if (player?.id && player?.name) {
          try {
            const chatsToDelete = await Chat.find({ participants: player.name });
            const chatIds = chatsToDelete.map(chat => chat._id);
      
            const chatRes = await Chat.deleteMany({ _id: { $in: chatIds } });
            const messageRes = await Message.deleteMany({ chat: { $in: chatIds } });
            const senderRes = await Message.deleteMany({ sender: player.id });
      
            console.log(
              `Deleted ${chatRes.deletedCount} chat(s), ${messageRes.deletedCount} message(s), ${senderRes.deletedCount} from ${player.name}`
            );
      
            for (const chat of chatsToDelete) {
              const opponent = chat.participants.find(p => p !== player.name);
              const opponentSocketId = Object.keys(players).find(
                key => players[key].name === opponent
              );
      
              if (opponentSocketId) {
                io.to(opponentSocketId).emit("chat list update", {
                  user1: player.name,
                  user2: opponent,
                });
                io.to(opponentSocketId).emit("opponentLeft", {
                    opponent: player.name,
                    message: `${player.name} has left the chat.`,
                  });
              }
            }
      
            socket.emit("chat list update", {
              user1: player.name,
              user2: null,
              reason: "player left",
            });
      
          } catch (err) {
            console.error("Error deleting player data:", err);
          }
        }
      });
      
      
  });
};

export default configureSocket;
