import { hash } from "bcryptjs";
import type { NextFunction } from "express";
import { model, Schema, type CallbackWithoutResult } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string | undefined;
  otp: string | undefined;
  emailVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, lowercase: true, trim: true, required: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email address provided.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    otp: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password! = await hash(this.password!, 10);
});

export default model("user", userSchema);
