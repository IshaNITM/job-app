import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const fmtMoney = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const tipBox = {
  background: '#151a22',
  border: '1px solid #2a3444',
  borderRadius: 8,
};

function useChartLayout() {
  const [layout, setLayout] = useState({ height: 260, compact: false });
  useEffect(() => {
    const go = () => {
      const w = window.innerWidth;
      setLayout({
        height: w < 400 ? 210 : w < 640 ? 235 : w < 960 ? 250 : 270,
        compact: w < 640,
      });
    };
    go();
    window.addEventListener('resize', go);
    return () => window.removeEventListener('resize', go);
  }, []);
  return layout;
}

export default function RevenueChart({ daily, peakHours }) {
  const { height, compact } = useChartLayout();
  const revData = daily?.map((d) => ({ date: d._id, total: d.total })) ?? [];
  const hourData =
    peakHours?.map((h) => ({ name: h.label, checkins: h.checkins })) ?? [];
  const tick = '#8b98ab';

  return (
    <div className="rev-charts">
      <div className="panel rev-panel">
        <div className="panel-title-row">
          <h2>Revenue (30 days)</h2>
        </div>
        <div className="rev-chart-inner">
          <div style={{ width: '100%', height, minWidth: compact ? 280 : 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ee8a8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#3ee8a8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3444" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: tick, fontSize: compact ? 9 : 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2a3444' }}
                  angle={compact ? -35 : 0}
                  textAnchor={compact ? 'end' : 'middle'}
                  height={compact ? 52 : 28}
                  interval={compact ? 'preserveStartEnd' : 0}
                />
                <YAxis
                  tick={{ fill: tick, fontSize: compact ? 10 : 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={compact ? 36 : 44}
                />
                <Tooltip
                  contentStyle={tipBox}
                  labelStyle={{ color: '#e8edf5' }}
                  formatter={(val) => [fmtMoney(val), 'Collected']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3ee8a8"
                  fill="url(#revFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel rev-panel">
        <div className="panel-title-row">
          <h2>Peak hours (check-ins)</h2>
          <span className="muted">Last 30 days · hourly heat</span>
        </div>
        <div className="rev-chart-inner">
          <div style={{ width: '100%', height, minWidth: compact ? 320 : 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3444" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: tick, fontSize: compact ? 9 : 10 }}
                  interval={compact ? 2 : 1}
                  tickLine={false}
                  axisLine={{ stroke: '#2a3444' }}
                />
                <YAxis tick={{ fill: tick, fontSize: compact ? 10 : 11 }} width={compact ? 32 : 40} />
                <Tooltip contentStyle={tipBox} formatter={(val) => [val, 'Check-ins']} />
                <Bar dataKey="checkins" fill="#59c4ff" radius={[4, 4, 0, 0]} maxBarSize={compact ? 28 : 48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
