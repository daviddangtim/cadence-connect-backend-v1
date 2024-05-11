/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "A type of Point is required"],
    enum: {
      values: ["Point"],
      message: "Enum value must be 'Point'",
    },
  },
  coordinates: {
    type: [Number],
    required: [
      true,
      "The 'coordinates' field for location is required and must be an array of numbers [longitude, latitude",
    ],
  },
});

export default pointSchema;
