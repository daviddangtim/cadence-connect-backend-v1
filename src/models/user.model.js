import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: ["An email is required"],
      validate: [validator.isEmail, "Please enter a valid email"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Confirm password does not match password",
      },
    },
    role: {
      type: String,
      enum: ["admin", "client", "eventPlanner"],
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  //CONFIRM PASSWORD SHOULD NOT BE PERSISTED IN THE DB
  this.confirmPasswod = undefined;
});

const User = mongoose.model("User", userSchema);
export default User;
