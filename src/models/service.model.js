import mongoose from "mongoose";
import slugify from "slugify";
import locationSchema from "./schemas/location.schema.js";

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
    datesAvailable: {
      type: [Date],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A service must have a description"],
      minlength: [200, "Description cannot be less than 400 characters long"],
      maxlength: [800, "Description cannot be more than 1000 characters long"],
    },
    handleEmergency: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, "A service must have a cover image"],
    },
    images: [String],
    location: {
      type: locationSchema,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [1, "Name cannot be less than 1 character"],
      maxlength: [40, "Name cannot be more than 40 characters"],
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, "Rating quantity cannot be less than 0"],
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "A service must have a summary"],
      minlength: [150, "Summary cannot be less than 200 characters long"],
      maxlength: [300, "Summary cannot be more than 500 characters long"],
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

serviceSchema.index({ location: "2dsphere" });
const Service = mongoose.model("Service", serviceSchema);
export default Service;
