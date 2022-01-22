import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    video: {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
    year: {
      type: String,
      required: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
      uppercase: true,
    },
    watchedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

export default mongoose.model("ClassLink", ClassSchema);
