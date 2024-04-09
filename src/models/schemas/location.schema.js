import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: [true, "The 'type' field for location must be 'Point'"],
  },
  coordinates: {
    type: [Number],
    required: [
      true,
      "The 'coordinates' field for location is required and must be an array of numbers [longitude, latitude]",
    ],
  },
});

export default locationSchema;
