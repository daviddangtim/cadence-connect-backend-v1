/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    gender: {
      type: String,
      required: [false, "Gender is required"],
      enum: {
        values: ["male", "female"],
      },
      message: "Gender Must be male or female",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      required: [true, "Password is required"],
    },
    passwordChangedAt: Date,
    passwordConfirm: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Confirm password must be the same with password",
      },
    },
    passwordResetExpires: Date,
    passwordResetToken: String,
    phone: String,
    photo: String,
    role: {
      type: String,
      enum: {
        values: ["client", "provider", "admin"],
        message: "Role must be of type user, provider or admin only",
      },
      default: "client",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log(`password is modified?: ${this.isModified("password")}`);
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined; // does not need to be persisted
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // NOTICE: removed 1 sec to make sure that passwordChangedAt will be less than jwt because of save difference
  next();
});

// biome-ignore lint/complexity/useArrowFunction: <explanation>
userSchema.methods.comparePassword = async function (
  plaintextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};

userSchema.methods.passwordChangedAfterJwt = function (jwtIsa) {
  if (!this.passwordChangedAt) return false;
  // biome-ignore lint/style/useNumberNamespace: <explanation>
  const passwordIsa = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

  // return true when passworIsa is greater than jwtIas
  return passwordIsa > jwtIsa;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // this is 5 mins in ms

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
