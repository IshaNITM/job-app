import { useEffect, useState } from 'react';
import {
  fetchGyms,
  fetchOccupancy,
  fetchRevenue,
  fetchChurnRisk,
  fetchAnomalies,
} from '../api/client.js';
import OccupancyCard from '../components/OccupancyCard.jsx';
import RevenueChart from '../components/RevenueChart.jsx';
import ChurnRiskPanel from '../components/ChurnRiskPanel.jsx';
import AnomalyAlertList from '../components/AnomalyAlertList.jsx';

export default function Dashboard() {
  const [gyms, setGyms] = useState([]);
  const [occMap, setOccMap] = useState({});
  const [revenue, setRevenue] = useState(null);
  const [churn, setChurn] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setErr(null);
      setLoading(true);
      try {
        const [gList, rev, ch, anom] = await Promise.all([
          fetchGyms(),
          fetchRevenue(),
          fetchChurnRisk(),
          fetchAnomalies(),
        ]);
        if (cancelled) return;
        setGyms(gList);
        setRevenue(rev);
        setChurn(ch);
        setAnomalies(anom);

        const occEntries = await Promise.all(
          gList.map(async (g) => {
            try {
              const o = await fetchOccupancy(g._id);
              return [g._id, o];
            } catch {
              return [g._id, null];
            }
          })
        );
        if (!cancelled) {
          setOccMap(Object.fromEntries(occEntries));
        }
      } catch (e) {
        if (!cancelled) {
          const payload = e?.response?.data;
          setErr(
            (typeof payload === 'object' && payload?.error) ||
              (typeof payload === 'string' ? payload : null) ||
              e.message ||
              'Failed to load dashboard. Is the API running?'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalMembers = gyms.reduce((s, g) => s + (g.memberCount || 0), 0);

  if (loading) {
    return (
      <div className="loading">
        <span>Loading LivePulse data…</span>
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Network overview</h1>
        <p className="page-intro">
          {totalMembers.toLocaleString('en-IN')} members across {gyms.length}{' '}
          active gyms · live occupancy &amp; risk signals
        </p>
      </header>

      {err && <div className="error-banner">{err}</div>}

      <AnomalyAlertList anomalies={anomalies} />

      <div className="card-grid">
        {gyms.map((g) => (
          <OccupancyCard key={g._id} gym={g} occupancy={occMap[g._id]} />
        ))}
      </div>

      <RevenueChart daily={revenue?.daily} peakHours={revenue?.peakHours} />

      <ChurnRiskPanel members={churn?.members} />
    </>
  );
}
