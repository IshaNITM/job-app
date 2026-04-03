export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function buildHourlyWeightTable() {
  const w = Array(24).fill(0);
  for (let h = 0; h < 5; h++) w[h] = 0;
  w[5] = 0.3;
  w[6] = 0.6;
  w[7] = w[8] = w[9] = 1.0;
  w[10] = w[11] = 0.4;
  w[12] = w[13] = 0.3;
  w[14] = w[15] = w[16] = 0.2;
  w[17] = w[18] = w[19] = w[20] = 0.9;
  w[21] = 0.35;
  w[22] = 0.35 * 0.5;
  w[23] = 0;
  return w;
}

export const WEEKDAY_MULTIPLIER = {
  1: 1.0,
  2: 0.95,
  3: 0.9,
  4: 0.95,
  5: 0.85,
  6: 0.7,
  0: 0.45,
};

export function weekdayMultiplierForDate(d) {
  return WEEKDAY_MULTIPLIER[d.getDay()] ?? 1;
}

export function randomMinuteInHour(hour) {
  if (hour === 5) return 30 + Math.floor(Math.random() * 30);
  if (hour === 22) return Math.floor(Math.random() * 31);
  return Math.floor(Math.random() * 60);
}
