// pages/api/watches/index.js
import { connectDB } from '../../../../utils_api';
import Watch from '../../../../models_api/Watch';
import { requireAdmin } from '../../../../lib/apiAuth';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    // public list (simple)
    const items = await Watch.find({}).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ items, total: items.length });
  }

  if (req.method === 'POST') {
    // admin-only create
    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return; // requireAdmin already sent response
    try {
      const body = req.body || {};
      const watch = await Watch.create(body);
      return res.status(201).json(watch);
    } catch (err) {
      console.error('Create watch err', err);
      return res.status(400).json({ message: err.message || 'Create failed' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
