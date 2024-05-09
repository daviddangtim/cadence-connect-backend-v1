/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from "socket.io";

// eslint-disable-next-line import/prefer-default-export
export const sServer = new Server();

export default (httpServer) => {
  httpServer.on("connection", (socketServer) => {
    console.log("a nwe client connected");
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
    socketServer.on("", () => {});
  });
};
