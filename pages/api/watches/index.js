import { connectDB } from "../../../lib/db";
import Watch from "../../../lib/models/Watch";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const items = await Watch.find();
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const { name, model, subModel, modelId, price, image } = req.body;
    const w = await Watch.create({ name, price, image });
    return res.status(201).json(w);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
