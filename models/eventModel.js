import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ratingSQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: [true, "An event must a summary"],
    },
    location: {
      type: Number,
      required: [true, "An Event Must a location"],
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  },
);
