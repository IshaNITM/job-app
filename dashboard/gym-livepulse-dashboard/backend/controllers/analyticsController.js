import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import Checkin from '../models/Checkin.js';

const aggOpts = { allowDiskUse: true, maxTimeMS: 120_000 };

export async function getRevenueAnalytics(req, res) {
  try {
    const { gymId } = req.query;
    const start = new Date();
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    const match = { paidAt: { $gte: start }, amount: { $exists: true } };
    if (gymId && mongoose.isValidObjectId(gymId)) {
      match.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const daily = await Payment.aggregate(
      [
        { $match: match },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$paidAt',
                timezone: 'Asia/Kolkata',
              },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ],
      aggOpts
    );

    const heatMatch = {
      checkedIn: { $gte: start, $exists: true, $type: 'date' },
    };
    if (gymId && mongoose.isValidObjectId(gymId)) {
      heatMatch.gymId = new mongoose.Types.ObjectId(gymId);
    }

    const byHour = await Checkin.aggregate(
      [
        { $match: heatMatch },
        {
          $group: {
            _id: { $hour: { $toDate: '$checkedIn' } },
            checkins: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ],
      aggOpts
    );

    res.json({
      total30d: daily.reduce((s, d) => s + d.total, 0),
      daily,
      peakHours: byHour.map((h) => ({
        hour: h._id,
        label: `${String(h._id).padStart(2, '0')}:00`,
        checkins: h.checkins,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getChurnRisk(req, res) {
  try {
    const { tier } = req.query;
    const filter = { churnRiskTier: { $in: ['high', 'critical'] } };
    if (tier === 'high' || tier === 'critical') {
      filter.churnRiskTier = tier;
    }

    const members = await Member.find(filter)
      .populate('gymId', 'name city')
      .sort({ churnRiskTier: -1, lastCheckinAt: 1 })
      .limit(500)
      .lean();

    res.json({
      count: members.length,
      members: members.map((m) => ({
        _id: m._id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        planType: m.planType,
        status: m.status,
        churnRiskTier: m.churnRiskTier,
        lastCheckinAt: m.lastCheckinAt,
        gym: m.gymId,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
