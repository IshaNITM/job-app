import { useEffect, useState } from 'react';
import { fetchMembers, fetchGyms } from '../api/client.js';

export default function Members() {
  const [data, setData] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [gymId, setGymId] = useState('');
  const [page, setPage] = useState(1);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchGyms().then(setGyms).catch(() => {});
  }, []);

  useEffect(() => {
    let c = false;
    async function load() {
      setErr(null);
      try {
        const res = await fetchMembers({
          page,
          limit: 25,
          ...(gymId ? { gymId } : {}),
        });
        if (!c) setData(res);
      } catch (e) {
        if (!c) setErr(e.message);
      }
    }
    load();
    return () => {
      c = true;
    };
  }, [page, gymId]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-intro">Paginated directory (seeded dataset)</p>
      </header>

      <div className="toolbar panel">
        <label htmlFor="gym-filter">
          Filter by gym
          <select
            id="gym-filter"
            className="form-select"
            value={gymId}
            onChange={(e) => {
              setPage(1);
              setGymId(e.target.value);
            }}
          >
            <option value="">All locations</option>
            {gyms.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {err && <div className="error-banner">{err}</div>}

      <div className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gym</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {(data?.members ?? []).map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.gymId?.name}</td>
                  <td>{m.planType}</td>
                  <td>{m.status}</td>
                  <td>
                    {m.churnRiskTier !== 'none' ? (
                      <span
                        className={`badge badge-${m.churnRiskTier === 'critical' ? 'critical' : 'high'}`}
                      >
                        {m.churnRiskTier}
                      </span>
                    ) : (
                      <span className="badge badge-ok">ok</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-bar muted">
          <span>
            Page {data?.page ?? 1} of {data?.pages ?? 1} · {data?.total ?? 0}{' '}
            members
          </span>
          <div className="pagination-actions">
            <button
              type="button"
              className="btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn"
              disabled={page >= (data?.pages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
