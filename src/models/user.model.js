import mongoose from "mongoose";
import { generateHash,comparePassword } from "../utils/passwordUtils.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    bio: { type: String },
    projects: [{ title: String, link: String, description: String }],
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    tokenExpiration: { type: Date },
    refreshToken: String,
    refreshTokenExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await generateHash(this.password);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;
