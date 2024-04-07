import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [1, ["Name cannot less than 1 character"]],
      maxLength: [20, ["Name cannot be more than 20 characters"]],
    },
    ratingSQuantity: {
      type: Number,
      default: 0,
      min: [0, "Ratings quantity cannot be less than 0"],
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "An event must have a description"],
      minLength: [50, "Description cannot be less than 50 characters long"],
      maxLength: [150, "Description cannot be more than 150 characters long"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "An event must a summary"],
      minLength: [20, "Summary cannot be less than 20 characters long"],
      maxLength: [100, "Summary cannot be more than 100 characters long"],
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

const Event = mongoose.model("Event", eventSchema);
export default Event;
