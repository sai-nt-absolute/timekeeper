import mongoose from "mongoose";

const WatchSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

export default mongoose.models.Watch || mongoose.model("Watch", WatchSchema);
