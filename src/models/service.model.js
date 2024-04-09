import mongoose from "mongoose";
import slugify from "slugify";

const serviceSchema = new mongoose.Schema(
  {
    cacVerified: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      required: [true, "A service must have a category"],
    },
    dateAvailable: {
      type: [Date],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A service must have a description"],
      minLength: [400, "Description cannot be less than 400 characters long"],
      maxLength: [1000, "Description cannot be more than 1000 characters long"],
    },
    handleEmergency: {
      type: Boolean,
      default: false,
    },
    location: {
      type: Number,
      required: [true, "A service Must have a location"],
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [1, ["Name cannot be less than 1 character"]],
      maxLength: [40, ["Name cannot be more than 40 characters"]],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, "Rating quantity cannot be less than 0"],
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "A service must have a summary"],
      minLength: [200, "Summary cannot be less than 200 characters long"],
      maxLength: [500, "Summary cannot be more than 100 characters long"],
    },
  },
  {
    timestamps: true,
    virtuals: true,
  },
);

serviceSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Event = mongoose.model("Service", serviceSchema);
export default Event;
