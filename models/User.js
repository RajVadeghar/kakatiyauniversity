import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
      uppercase: true,
    },
    dateOfJoining: {
      type: String,
    },
    dateOfPassOut: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isFaculty: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    dateOfBirth: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

export default mongoose.model("User", UserSchema);
