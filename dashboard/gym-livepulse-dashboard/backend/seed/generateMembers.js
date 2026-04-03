import { faker } from '@faker-js/faker';
import {
  amountForPlan,
  GYM_MEMBER_SPECS,
  planDurationDays,
} from './gymFixtures.js';
import { daysAgo } from '../utils/dateUtils.js';

const MS_DAY = 24 * 60 * 60 * 1000;

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function indianPhone() {
  const p = faker.helpers.arrayElement(['9', '8', '7']);
  return p + faker.string.numeric(9);
}

function uniqueEmail(first, last, used) {
  let e;
  let tries = 0;
  do {
    const n = faker.number.int({ min: 10, max: 99 });
    e = `${first}.${last}${n}@gmail.com`.toLowerCase().replace(/[^a-z0-9.@]/g, '');
    tries++;
  } while (used.has(e) && tries < 50);
  if (used.has(e)) {
    e = `user.${faker.string.alphanumeric(12)}@gmail.com`.toLowerCase();
  }
  used.add(e);
  return e;
}

function pickStatus(activePct) {
  const r = Math.random() * 100;
  if (r < activePct) return 'active';
  if (r < activePct + 8) return 'inactive';
  return 'frozen';
}

export function generateMemberDocs(gyms) {
  if (gyms.length !== GYM_MEMBER_SPECS.length) {
    throw new Error('generateMemberDocs: gym count must match GYM_MEMBER_SPECS');
  }

  faker.seed(42);
  const usedEmails = new Set();
  const members = [];
  const CRIT_N = 100;
  const HIGH_N = 180;

  for (let gi = 0; gi < gyms.length; gi++) {
    const gym = gyms[gi];
    const spec = GYM_MEMBER_SPECS[gi];
    const plans = [];
    for (let i = 0; i < spec.monthly; i++) plans.push('monthly');
    for (let i = 0; i < spec.quarterly; i++) plans.push('quarterly');
    for (let i = 0; i < spec.annual; i++) plans.push('annual');
    shuffleInPlace(plans);

    for (const planType of plans) {
      const fn = faker.person.firstName();
      const ln = faker.person.lastName();
      const memberType = Math.random() < 0.8 ? 'new' : 'renewal';
      const status = pickStatus(spec.activePct);
      const joinedAt =
        status === 'inactive'
          ? daysAgo(faker.number.int({ min: 91, max: 180 }))
          : daysAgo(faker.number.int({ min: 0, max: 90 }));
      const dur = planDurationDays(planType);

      members.push({
        name: `${fn} ${ln}`,
        email: uniqueEmail(fn, ln, usedEmails),
        phone: indianPhone(),
        gymId: gym._id,
        planType,
        memberType,
        status,
        joinedAt,
        planExpiresAt: new Date(joinedAt.getTime() + dur * MS_DAY),
        lastCheckinAt: null,
        churnRiskTier: 'none',
        _planAmount: amountForPlan(planType),
      });
    }
  }

  const activeIdx = members
    .map((m, i) => (m.status === 'active' ? i : -1))
    .filter((i) => i >= 0);
  shuffleInPlace(activeIdx);

  for (const si of activeIdx.slice(0, CRIT_N)) {
    const m = members[si];
    m.churnRiskTier = 'critical';
    m.lastCheckinAt = daysAgo(faker.number.int({ min: 61, max: 120 }));
  }
  for (const si of activeIdx.slice(CRIT_N, CRIT_N + HIGH_N)) {
    const m = members[si];
    if (m.churnRiskTier === 'critical') continue;
    m.churnRiskTier = 'high';
    m.lastCheckinAt = daysAgo(faker.number.int({ min: 45, max: 60 }));
  }

  for (const m of members) {
    if (m.churnRiskTier !== 'none') continue;
    if (m.status !== 'active') {
      m.lastCheckinAt = daysAgo(faker.number.int({ min: 20, max: 80 }));
    } else {
      const days = faker.number.float({ min: 0, max: 44, fractionDigits: 2 });
      m.lastCheckinAt = new Date(Date.now() - days * MS_DAY);
    }
  }

  shuffleInPlace(members);
  return members;
}
