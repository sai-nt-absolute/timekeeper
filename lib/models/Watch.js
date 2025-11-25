import mongoose from "mongoose";

const WatchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  model: { type: String, trim: true, default: "" },
  subModel: { type: String, trim: true, default: "" },
  modelId: { type: String, trim: true, index: true, default: "" }, // keep as string for flexibility (UUIDs, numbers, etc.)
  price: { type: Number, required: true },
  image: { type: String, default: "" } // stores URL or path
}, { timestamps: true }); // adds createdAt and updatedAt

export default mongoose.models.Watch || mongoose.model("Watch", WatchSchema);
