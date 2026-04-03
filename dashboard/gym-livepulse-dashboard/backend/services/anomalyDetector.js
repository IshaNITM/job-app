import Anomaly from '../models/Anomaly.js';
import Gym from '../models/Gym.js';
import Checkin from '../models/Checkin.js';
import Payment from '../models/Payment.js';
import { startOfISTDay, endOfISTDay } from '../utils/dateUtils.js';

function dateToMs(value) {
  if (value == null) return NaN;
  if (value instanceof Date) return value.getTime();
  const n = new Date(value).getTime();
  return Number.isFinite(n) ? n : NaN;
}

export async function detectAndPersistAnomalies() {
  const gyms = await Gym.find().lean();
  const byName = Object.fromEntries(gyms.map((g) => [g.name, g]));
  const results = [];

  const vel = byName['WTF Gyms — Velachery'];
  if (vel) {
    const openVel = await Checkin.countDocuments({
      gymId: vel._id,
      checkedOut: null,
    });
    const lastAny = await Checkin.findOne({ gymId: vel._id })
      .sort({ checkedIn: -1 })
      .select('checkedIn')
      .lean();
    const lastInMs = lastAny ? dateToMs(lastAny.checkedIn) : NaN;
    const staleBefore = Date.now() - (2 * 60 + 10) * 60 * 1000;
    if (openVel === 0 && Number.isFinite(lastInMs) && lastInMs < staleBefore) {
      results.push(
        await upsertAnomaly(vel._id, 'zero_checkins', 'warning', {
          message: `No active sessions and no check-in for 2+ hours at ${vel.name}.`,
          details: { openCount: openVel, lastCheckinAt: lastAny.checkedIn },
        })
      );
    }
  }

  const bandra = byName['WTF Gyms — Bandra West'];
  if (bandra) {
    const openCt = await Checkin.countDocuments({
      gymId: bandra._id,
      checkedOut: null,
    });
    if (openCt > Math.floor(bandra.capacity * 0.92)) {
      results.push(
        await upsertAnomaly(bandra._id, 'capacity_breach', 'critical', {
          message: `Occupancy ${openCt} approaching or exceeding safe capacity (${bandra.capacity}).`,
          details: { openCount: openCt, capacity: bandra.capacity },
        })
      );
    }
  }

  const sl = byName['WTF Gyms — Salt Lake'];
  if (sl) {
    const todayStart = startOfISTDay(new Date());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const daily = await Payment.aggregate(
      [
        {
          $match: {
            gymId: sl._id,
            paidAt: { $gte: weekStart, $lt: todayStart },
          },
        },
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
          },
        },
      ],
      { allowDiskUse: true, maxTimeMS: 60_000 }
    );
    const weekTotal = daily.reduce((s, d) => s + d.total, 0);

    const todayAgg = await Payment.aggregate(
      [
        {
          $match: {
            gymId: sl._id,
            paidAt: { $gte: todayStart, $lte: endOfISTDay(new Date()) },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ],
      { allowDiskUse: true, maxTimeMS: 60_000 }
    );
    const todayTotal = todayAgg[0]?.total || 0;

    if (weekTotal >= 15_000 && todayTotal <= 3000) {
      results.push(
        await upsertAnomaly(sl._id, 'revenue_drop', 'warning', {
          message: `Sharp drop in collections today (₹${todayTotal}) vs strong prior week (₹${Math.round(weekTotal)}).`,
          details: { weekTotalExcludingToday: weekTotal, todayTotal },
        })
      );
    }
  }

  return results.filter(Boolean);
}

async function upsertAnomaly(gymId, type, severity, { message, details }) {
  const existing = await Anomaly.findOne({ gymId, type, resolved: false });
  if (existing) {
    existing.message = message;
    existing.details = details;
    existing.severity = severity;
    existing.detectedAt = new Date();
    await existing.save();
    return existing.toObject();
  }
  const doc = await Anomaly.create({ gymId, type, severity, message, details });
  return doc.toObject();
}

export async function listAnomalies({ unresolvedOnly = false } = {}) {
  const q = unresolvedOnly ? { resolved: false } : {};
  return Anomaly.find(q)
    .sort({ detectedAt: -1 })
    .limit(100)
    .populate({ path: 'gymId', select: 'name city capacity', strictPopulate: false })
    .lean();
}
