import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value === this.price;
        },
        message: "Amount must be equal to the price",
      },
    },
    price: {
      type: Number,
      required: [true, "A payment must have a price"],
    },
    receiverId: {
      type: String,
      required: [true, "A payment must have a receiver"],
      trim: true,
    },
    senderId: {
      type: String,
      required: [true, "A payment must have a sender"],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "done", "error"],
    },
    paymentType: {
      type: String,
      required: [true, "A payment must have a payment type"],
      enum: ["cadenceSavings", "eventPayment"],
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
