import mongoose from "mongoose";
import { accountSchema } from "./account.js";

const newsSchema = mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  content: { type: String },
  views: { type: Number, default: 0 },
  image: { type: Buffer },
  time: {
    type: Date,
    default: new Date(),
  },
  writer: { type: String },
});

newsSchema.methods.toJSON = function () {
  const result = this.toObject();
  delete result.image;
  return result;
};

const NewsModel = mongoose.model("News", newsSchema);

export default NewsModel;
