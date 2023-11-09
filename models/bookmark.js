import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Bookmark",
  mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      mediaId: {
        type: String,
        required: true,
      },
      mediaType: {
        type: String,
        enum: ["tv", "movie"],
        required: true,
      },
    },
    modelOptions
  )
);
