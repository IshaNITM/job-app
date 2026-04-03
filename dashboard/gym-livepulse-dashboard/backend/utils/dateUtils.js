export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function startOfISTDay(d = new Date()) {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}

export function endOfISTDay(d = new Date()) {
  const s = startOfISTDay(d);
  return new Date(s.getTime() + 24 * 60 * 60 * 1000 - 1);
}

export function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
