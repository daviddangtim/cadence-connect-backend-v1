/* eslint-disable prettier/prettier */

import mongoose from "mongoose";
import slugify from "slugify";
import pointSchema from "./point.schema.js";

const serviceSchema = new mongoose.Schema(
  {
    cacVerified: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: [String],
      required: [true, "A category is required"],
      validate: {
        validator: (value) => {
          const values = [
            "wedding",
            "parties and celebration",
            "culture and religion",
            "sport",
            "rental",
          ];
          return value.every((category) =>
            values.includes(category.toLowerCase()),
          );
        },
        message:
          "Invalid category. Category must be of type: Wedding, parties and celebration, culture and religion, sport, rental",
      },
    },
    coverImage: {
      type: String,
      required: [false, "A cover image is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 200,
      maxLength: 500,
    },
    emergency: {
      type: Boolean,
      default: false,
    },
    images: [String],
    location: {
      type: pointSchema,
      required: [false, "A location is required"],
      index: "2dsphere",
    },
    maxBudget: {
      type: Number,
      required: [true, "A maximum budget is required"],
      validate: {
        validator: function (value) {
          return value > this.minBudget;
        },
        message:
          "Maximum budget: {VALUE} cannot be less than the minimum budget",
      },
    },
    minBudget: {
      type: Number,
      required: [true, "A minimum budget is required"],
      validate: {
        validator: function (value) {
          return this.maxBudget > value;
        },
        message:
          "Minimum budget: {VALUE} cannot be greater than the maximum budget",
      },
    },
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: 1,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    schedule: [Date],
    slug: String,
    summary: {
      type: String,
      required: [true, "A summary is required"],
      minlength: 50,
      maxlength: 150,
    },
  },
  { timestamps: true },
);

serviceSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

serviceSchema.pre("save", function (next) {
  if (!this.isModified("categories")) return next();

  this.categories.forEach((category, index) => {
    this.categories[index] = category.toLowerCase();
  });
  next();
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
