import { amountForPlan, planDurationDays } from './gymFixtures.js';
import { startOfISTDay } from '../utils/dateUtils.js';
import { randomInt } from '../utils/distributionUtils.js';

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_MIN = 60 * 1000;
const MS_HOUR = 60 * MS_MIN;

export async function seedPayments(Payment, gymByName, members) {
  const saltLake = gymByName['WTF Gyms — Salt Lake'];
  const batch = [];

  const flush = async (arr) => {
    if (arr.length) await Payment.insertMany(arr, { ordered: false });
  };

  for (const m of members) {
    const amt = amountForPlan(m.planType);
    const jitterMin = Math.floor(Math.random() * 11) - 5;
    let firstPaid = new Date(m.joinedAt.getTime() + jitterMin * MS_MIN);
    const capPast = Date.now() - MS_MIN;
    if (firstPaid.getTime() > capPast) firstPaid = new Date(capPast - MS_DAY);

    batch.push({
      memberId: m._id,
      gymId: m.gymId,
      amount: amt,
      paymentType: m.memberType === 'renewal' ? 'renewal' : 'new',
      paidAt: firstPaid,
    });

    if (m.memberType === 'renewal') {
      let secondPaid = new Date(
        firstPaid.getTime() + planDurationDays(m.planType) * MS_DAY
      );
      if (secondPaid.getTime() > capPast) {
        secondPaid = new Date(capPast - randomInt(1, 48) * MS_HOUR);
      }
      if (secondPaid.getTime() <= firstPaid.getTime()) {
        secondPaid = new Date(firstPaid.getTime() + MS_DAY);
      }
      batch.push({
        memberId: m._id,
        gymId: m.gymId,
        amount: amt,
        paymentType: 'renewal',
        paidAt: secondPaid,
      });
    }

    if (batch.length >= 5000) {
      await flush(batch.splice(0, batch.length));
    }
  }

  await flush(batch);
  await shapeSaltLakeRevenueAnomaly(Payment, saltLake._id);
}

async function shapeSaltLakeRevenueAnomaly(Payment, saltLakeId) {
  const todayStart = startOfISTDay(new Date());
  const spikeDayStart = new Date(todayStart);
  spikeDayStart.setDate(spikeDayStart.getDate() - 7);
  const day0 = startOfISTDay(spikeDayStart);

  const candidates = await Payment.find({ gymId: saltLakeId })
    .sort({ paidAt: -1 })
    .limit(45)
    .select('_id');

  const amounts = [2500, 2800, 2200, 3000, 2600, 2400, 2000, 2000];
  const n = Math.min(8, candidates.length, amounts.length);
  for (let i = 0; i < n; i++) {
    await Payment.updateOne(
      { _id: candidates[i]._id },
      {
        $set: {
          amount: amounts[i],
          paymentType: 'renewal',
          paidAt: new Date(
            day0.getTime() +
              randomInt(0, 9) * MS_HOUR +
              randomInt(0, 55) * MS_MIN
          ),
        },
      }
    );
  }

  const yesterday = new Date(todayStart.getTime() - MS_DAY);
  for (let iter = 0; iter < 80; iter++) {
    const rows = await Payment.find({
      gymId: saltLakeId,
      paidAt: { $gte: todayStart },
    })
      .sort({ amount: -1 })
      .limit(30);
    const sum = rows.reduce((s, p) => s + p.amount, 0);
    if (sum <= 3000 || !rows.length) break;
    const p = rows[0];
    await Payment.updateOne(
      { _id: p._id },
      {
        $set: {
          paidAt: new Date(
            yesterday.getTime() +
              randomInt(6, 20) * MS_HOUR +
              randomInt(0, 59) * MS_MIN
          ),
        },
      }
    );
  }
}
