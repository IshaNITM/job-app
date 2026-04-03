import Gym from '../models/Gym.js';
import Member from '../models/Member.js';
import Checkin from '../models/Checkin.js';

export async function getGyms(req, res) {
  try {
    const gyms = await Gym.find().sort({ city: 1, name: 1 }).lean();
    const memberCounts = await Member.aggregate([
      { $group: { _id: '$gymId', count: { $sum: 1 } } },
    ]);
    const mcMap = new Map(memberCounts.map((m) => [String(m._id), m.count]));
    const withCounts = gyms.map((g) => ({
      ...g,
      memberCount: mcMap.get(String(g._id)) || 0,
    }));
    res.json(withCounts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getGymById(req, res) {
  try {
    const g = await Gym.findById(req.params.id).lean();
    if (!g) return res.status(404).json({ error: 'Gym not found' });
    const [memberCount, openCount] = await Promise.all([
      Member.countDocuments({ gymId: g._id }),
      Checkin.countDocuments({ gymId: g._id, checkedOut: null }),
    ]);
    res.json({ ...g, memberCount, openCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getGymOccupancy(req, res) {
  try {
    const gym = await Gym.findById(req.params.id).lean();
    if (!gym) return res.status(404).json({ error: 'Gym not found' });

    const openCount = await Checkin.countDocuments({
      gymId: gym._id,
      checkedOut: null,
    });

    const utilizationPct = Math.round(
      (openCount / Math.max(1, gym.capacity)) * 1000
    ) / 10;

    res.json({
      gymId: gym._id,
      name: gym.name,
      capacity: gym.capacity,
      openSessions: openCount,
      utilizationPct,
      status: gym.status,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
