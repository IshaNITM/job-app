import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchGym, fetchOccupancy, fetchRevenue } from '../api/client.js';
import RevenueChart from '../components/RevenueChart.jsx';

export default function GymDetails() {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [occ, setOcc] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [g, o, rev] = await Promise.all([
          fetchGym(id),
          fetchOccupancy(id),
          fetchRevenue({ gymId: id }),
        ]);
        if (!cancelled) {
          setGym(g);
          setOcc(o);
          setRevenue(rev);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.response?.data?.error || e.message);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (err) {
    return <div className="error-banner">{err}</div>;
  }

  if (!gym) {
    return (
      <div className="loading">
        <span>Loading gym…</span>
      </div>
    );
  }

  const pct = occ?.utilizationPct ?? 0;

  return (
    <>
      <header className="page-header">
        <Link to="/" className="back-link">
          ← All gyms
        </Link>
        <h1 className="page-title">{gym.name}</h1>
        <p className="page-intro">
          {gym.city} · capacity {gym.capacity} ·{' '}
          <span className="badge badge-ok">{gym.status}</span>
        </p>
      </header>

      <div className="stat-grid">
        <div className="panel">
          <h2>Open sessions</h2>
          <p className="stat-value">{occ?.openSessions ?? '—'}</p>
          <p className="stat-hint">{pct}% utilization</p>
        </div>
        <div className="panel">
          <h2>Total members</h2>
          <p className="stat-value">{gym.memberCount}</p>
          <p className="stat-hint">Assigned home club</p>
        </div>
      </div>

      <RevenueChart daily={revenue?.daily} peakHours={revenue?.peakHours} />
    </>
  );
}
