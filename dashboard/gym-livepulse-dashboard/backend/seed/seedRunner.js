import Gym from '../models/Gym.js';
import Member from '../models/Member.js';
import Checkin from '../models/Checkin.js';
import Payment from '../models/Payment.js';
import Anomaly from '../models/Anomaly.js';
import { GYM_FIXTURES } from './gymFixtures.js';
import { generateMemberDocs } from './generateMembers.js';
import { seedCheckins } from './generateCheckins.js';
import { seedPayments } from './generatePayments.js';

async function clearAll() {
  await Promise.all([
    Anomaly.deleteMany({}),
    Payment.deleteMany({}),
    Checkin.deleteMany({}),
    Member.deleteMany({}),
    Gym.deleteMany({}),
  ]);
}

async function syncMemberLastCheckins() {
  const rows = await Checkin.aggregate([
    { $group: { _id: '$memberId', lastIn: { $max: '$checkedIn' } } },
  ]);
  const ops = rows.map((r) => ({
    updateOne: {
      filter: { _id: r._id },
      update: { $set: { lastCheckinAt: r.lastIn } },
    },
  }));
  if (!ops.length) return;
  const chunk = 5000;
  for (let i = 0; i < ops.length; i += chunk) {
    await Member.bulkWrite(ops.slice(i, i + chunk));
  }
}

export async function runFullSeed(opts = {}) {
  const FORCE = opts.force === true;
  console.time('seed');

  if (FORCE) {
    console.log('[seed] FORCE: clearing collections');
    await clearAll();
  }

  let gyms = await Gym.find().lean();
  if (!gyms.length) {
    console.log('[seed] Seeding gyms…');
    await Gym.insertMany(GYM_FIXTURES);
    gyms = await Gym.find().lean();
    console.log(`[seed] Seeding gyms… done (${gyms.length})`);
  } else {
    console.log(`[seed] gyms already present (${gyms.length})`);
  }

  const order = GYM_FIXTURES.map((g) => g.name);
  gyms.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  const gymByName = Object.fromEntries(gyms.map((g) => [g.name, g]));

  let memberCount = await Member.countDocuments();
  let members;

  if (memberCount === 0 || FORCE) {
    if (memberCount > 0 && FORCE) {
      await Member.deleteMany({});
      await Checkin.deleteMany({});
      await Payment.deleteMany({});
      await Anomaly.deleteMany({});
    }
    console.log('[seed] Seeding 5000 members…');
    const raw = generateMemberDocs(gyms);
    const docs = raw.map(({ _planAmount, ...m }) => m);
    await Member.insertMany(docs, { ordered: false });
    members = await Member.find().lean();
    console.log(`[seed] Seeding 5000 members… done (${members.length})`);
  } else {
    members = await Member.find().lean();
  }

  let checkinCount = await Checkin.countDocuments();
  if (checkinCount === 0 || FORCE) {
    if (checkinCount > 0 && FORCE) {
      await Checkin.deleteMany({});
      await Anomaly.deleteMany({});
    }
    console.log('[seed] Seeding ~90 days of check-ins…');
    const n = await seedCheckins(Checkin, gyms, members, 270_000);
    console.log(`[seed] Seeding ~90 days of check-ins… done (~${n})`);
    await syncMemberLastCheckins();
  }

  let payCount = await Payment.countDocuments();
  if (payCount === 0 || FORCE) {
    if (payCount > 0 && FORCE) {
      await Payment.deleteMany({});
      await Anomaly.deleteMany({});
    }
    console.log('[seed] Seeding payments…');
    await seedPayments(Payment, gymByName, members);
    console.log('[seed] Seeding payments… done');
  }

  console.timeEnd('seed');
}

export async function ensureSeeded() {
  if (process.env.AUTO_SEED_IF_EMPTY === 'false') return;
  if ((await Gym.countDocuments()) > 0) return;
  console.log('[seed] database empty — running full seed…');
  await runFullSeed({ force: false });
}
