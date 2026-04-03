import {
  buildHourlyWeightTable,
  weekdayMultiplierForDate,
  randomMinuteInHour,
  randomInt,
} from '../utils/distributionUtils.js';
import { hoursAgo } from '../utils/dateUtils.js';

const MS_MIN = 60 * 1000;
const MS_DAY = 24 * 60 * 60 * 1000;

export function openSessionRangeForGym(capacity) {
  if (capacity >= 250) return { min: 25, max: 35 };
  if (capacity >= 150) return { min: 15, max: 25 };
  return { min: 8, max: 15 };
}

function dayBlockedForMember(m, dayStart) {
  const t = dayStart.getTime();
  if (m.churnRiskTier === 'critical') return t > Date.now() - 60 * MS_DAY;
  if (m.churnRiskTier === 'high') return t > Date.now() - 45 * MS_DAY;
  return false;
}

function pickMemberForSlot(gymId, dayStart, membersByGym, churnSet) {
  const pool = membersByGym.get(gymId.toString()) || [];
  if (!pool.length) return null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const m = pool[Math.floor(Math.random() * pool.length)];
    if (churnSet.has(m._id.toString()) && dayBlockedForMember(m, dayStart)) continue;
    return m;
  }
  const normal = pool.filter((m) => !dayBlockedForMember(m, dayStart));
  if (!normal.length) return null;
  return normal[Math.floor(Math.random() * normal.length)];
}

export async function seedCheckins(
  Checkin,
  gyms,
  members,
  targetHistorical = 270_000
) {
  const hourlyW = buildHourlyWeightTable();
  const membersByGym = new Map();
  const churnSet = new Set();
  for (const m of members) {
    const k = m.gymId.toString();
    if (!membersByGym.has(k)) membersByGym.set(k, []);
    membersByGym.get(k).push(m);
    if (m.churnRiskTier === 'high' || m.churnRiskTier === 'critical') {
      churnSet.add(m._id.toString());
    }
  }

  const totalCap = gyms.reduce((s, g) => s + g.capacity, 0);
  const gymByName = Object.fromEntries(gyms.map((g) => [g.name, g]));
  const bandra = gymByName['WTF Gyms — Bandra West'];
  const velachery = gymByName['WTF Gyms — Velachery'];

  const batch = [];
  const flush = async () => {
    if (!batch.length) return;
    await Checkin.insertMany(batch.splice(0, batch.length), { ordered: false });
  };

  let created = 0;
  const startDay = new Date();
  startDay.setHours(12, 0, 0, 0);
  startDay.setDate(startDay.getDate() - 89);

  while (created < targetHistorical) {
    const dayOffset = Math.floor(Math.random() * 90);
    const day = new Date(startDay.getTime() + dayOffset * MS_DAY);
    const dayMult = weekdayMultiplierForDate(day);
    const weights = hourlyW.map((w) => w * dayMult);
    const tw = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * tw;
    let hour = 0;
    for (; hour < 24; hour++) {
      r -= weights[hour];
      if (r <= 0) break;
    }
    hour = Math.min(23, hour);
    if (hourlyW[hour] <= 0) continue;

    let gr = Math.random() * totalCap;
    let gym = gyms[0];
    for (const g of gyms) {
      gr -= g.capacity;
      if (gr <= 0) {
        gym = g;
        break;
      }
    }

    const checkedIn = new Date(day);
    checkedIn.setHours(hour, randomMinuteInHour(hour), 0, 0);
    const m = pickMemberForSlot(gym._id, day, membersByGym, churnSet);
    if (!m) continue;

    const sessionMin = randomInt(45, 90);
    batch.push({
      memberId: m._id,
      gymId: gym._id,
      checkedIn,
      checkedOut: new Date(checkedIn.getTime() + sessionMin * MS_MIN),
    });
    created++;
    if (batch.length >= 8000) await flush();
  }

  await flush();

  const openCounts = new Map();
  for (const g of gyms) {
    if (String(g._id) === String(velachery._id)) {
      openCounts.set(g._id.toString(), 0);
    } else if (String(g._id) === String(bandra._id)) {
      openCounts.set(g._id.toString(), randomInt(275, 295));
    } else {
      const { min, max } = openSessionRangeForGym(g.capacity);
      openCounts.set(g._id.toString(), randomInt(min, max));
    }
  }

  const usedOpenMembers = new Set();
  for (const g of gyms) {
    const want = openCounts.get(g._id.toString()) || 0;
    const pool = (membersByGym.get(g._id.toString()) || []).filter(
      (m) =>
        !churnSet.has(m._id.toString()) &&
        m.status === 'active' &&
        !usedOpenMembers.has(m._id.toString())
    );
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const n = Math.min(want, pool.length);
    for (let i = 0; i < n; i++) {
      const m = pool[i];
      usedOpenMembers.add(m._id.toString());
      const checkedIn = new Date(Date.now() - randomInt(5, 90) * MS_MIN);
      batch.push({
        memberId: m._id,
        gymId: g._id,
        checkedIn,
        checkedOut: null,
      });
    }
  }

  await flush();

  await Checkin.deleteMany({
    gymId: velachery._id,
    checkedIn: { $gt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  });

  const velMembers = membersByGym.get(velachery._id.toString()) || [];
  if (velMembers.length) {
    const vm = velMembers[Math.floor(Math.random() * velMembers.length)];
    const checkedIn = hoursAgo(3);
    await Checkin.create({
      memberId: vm._id,
      gymId: velachery._id,
      checkedIn,
      checkedOut: new Date(checkedIn.getTime() + 50 * MS_MIN),
    });
  }

  return created;
}
