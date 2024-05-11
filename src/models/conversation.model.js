/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import mongoose from "mongoose";

 const conversationSchema = new mongoose.Schema(
  {
    // sen
  },
  { timestamps: true },
);
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;