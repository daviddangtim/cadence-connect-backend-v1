import mongoose from "mongoose";

const { Schema } = mongoose;
const { Types } = Schema;
const messageSchema = new Schema(
  {
    messageId: {
      type: String,
      unique: true,
      default: Types.ObjectId,
    },
    senderId: {
      type: String,
      required: [true, "A message must have a sender"],
    },
    receiverId: {
      type: String,
      required: [true, "A message must have a receiver"],
    },
    message: {
      type: String,
      required: [true, "A message must have a body"],
    },
    groupId: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
