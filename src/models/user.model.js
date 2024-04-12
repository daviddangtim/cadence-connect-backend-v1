import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required Please provide your full name"],
      trim: true,
    },
    email: {
      type: String,
      required: [
        true,
        "An email address is required Please provide a valid email",
      ],
      validate: [
        validator.isEmail,
        "Invalid email format Please enter a valid email address",
      ],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      select: true,
      trim: true,
      required: [
        true,
        "A password is required Please create a secure password",
      ],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message:
          "Passwords do not match Please ensure both passwords are identical",
      },
    },
    userType: {
      type: String,
      enum: ["client", "serviceProvider"],
      required: [
        true,
        "A user type is required Please specify if you are a client or a service provider",
      ],
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
  //password is only hashed if it's  ever modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // The confirmPassword field is for validation only and should not be persisted
  this.confirmPassword = undefined;
  return next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password,
) {
  return await bcrypt.compare(candidatePassword, password);
};

const User = mongoose.model("User", userSchema);
export default User;
