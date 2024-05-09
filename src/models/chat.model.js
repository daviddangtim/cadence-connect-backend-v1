import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: [true, "A sender id is required"],
      trim: true,
    },
    receiverId: {
      type: String,
      required: [true, "A receiver id is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "A message is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
