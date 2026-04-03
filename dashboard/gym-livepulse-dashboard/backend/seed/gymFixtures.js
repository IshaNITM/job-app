export const GYM_FIXTURES = [
  {
    name: 'WTF Gyms — Lajpat Nagar',
    city: 'New Delhi',
    capacity: 220,
    opensAt: '05:30',
    closesAt: '22:30',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Connaught Place',
    city: 'New Delhi',
    capacity: 180,
    opensAt: '06:00',
    closesAt: '22:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Bandra West',
    city: 'Mumbai',
    capacity: 300,
    opensAt: '05:00',
    closesAt: '23:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Powai',
    city: 'Mumbai',
    capacity: 250,
    opensAt: '05:30',
    closesAt: '22:30',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Indiranagar',
    city: 'Bengaluru',
    capacity: 200,
    opensAt: '05:30',
    closesAt: '22:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Koramangala',
    city: 'Bengaluru',
    capacity: 180,
    opensAt: '06:00',
    closesAt: '22:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Banjara Hills',
    city: 'Hyderabad',
    capacity: 160,
    opensAt: '06:00',
    closesAt: '22:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Sector 18 Noida',
    city: 'Noida',
    capacity: 140,
    opensAt: '06:00',
    closesAt: '21:30',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Salt Lake',
    city: 'Kolkata',
    capacity: 120,
    opensAt: '06:00',
    closesAt: '21:00',
    status: 'active',
  },
  {
    name: 'WTF Gyms — Velachery',
    city: 'Chennai',
    capacity: 110,
    opensAt: '06:00',
    closesAt: '21:00',
    status: 'active',
  },
];

export const GYM_MEMBER_SPECS = [
  { monthly: 325, quarterly: 195, annual: 130, activePct: 88 },
  { monthly: 220, quarterly: 220, annual: 110, activePct: 85 },
  { monthly: 300, quarterly: 300, annual: 150, activePct: 90 },
  { monthly: 240, quarterly: 240, annual: 120, activePct: 87 },
  { monthly: 220, quarterly: 220, annual: 110, activePct: 89 },
  { monthly: 200, quarterly: 200, annual: 100, activePct: 86 },
  { monthly: 225, quarterly: 135, annual: 90, activePct: 84 },
  { monthly: 240, quarterly: 100, annual: 60, activePct: 82 },
  { monthly: 180, quarterly: 90, annual: 30, activePct: 80 },
  { monthly: 150, quarterly: 75, annual: 25, activePct: 78 },
];

export const PLAN_AMOUNTS = {
  monthly: 1499,
  quarterly: 3999,
  annual: 11999,
};

export function amountForPlan(planType) {
  return PLAN_AMOUNTS[planType];
}

export function planDurationDays(planType) {
  switch (planType) {
    case 'monthly':
      return 30;
    case 'quarterly':
      return 90;
    case 'annual':
      return 365;
    default:
      return 30;
  }
}
