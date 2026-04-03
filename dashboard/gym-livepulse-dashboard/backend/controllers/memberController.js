import Member from '../models/Member.js';

export async function getMembers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit, 10) || 25));
    const { gymId, status } = req.query;
    const filter = {};
    if (gymId) filter.gymId = gymId;
    if (status) filter.status = status;

    const [total, members] = await Promise.all([
      Member.countDocuments(filter),
      Member.find(filter)
        .populate('gymId', 'name city')
        .sort({ joinedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      members,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
