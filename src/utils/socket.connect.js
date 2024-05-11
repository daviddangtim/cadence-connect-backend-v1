/* eslint-disable prettier/prettier */

/* eslint-disable arrow-body-style */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from "socket.io";
// import http from "node:http";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// eslint-disable-next-line import/prefer-default-export
export const sServer = new Server();

export default (httpServer) => {
  httpServer.on("connection", (socketServer) => {
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
  });
};

// const server = http.createServer(app);
const io = new Server( {
cors: {
origin: "http://localhost:3000",
methods: ["GET", "POST"],
},
});



const userSocketMap = {}; // userId: socketId
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
  };

io.on("connection", (socket) => {
console.log("user connected", socket.id);
const userId = socket.handshake.query.userId;

if (userId !== "undefined") userSocketMap[userId] = socket.id;
io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
try {
await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
} catch (error) {
console.log(error);
}
});

socket.on("disconnect", () => {
console.log("user disconnected");
delete userSocketMap[userId];
io.emit("getOnlineUsers", Object.keys(userSocketMap));
});
});

export { io};

