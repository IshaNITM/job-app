function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ChurnRiskPanel({ members }) {
  const rows = members?.slice(0, 12) ?? [];

  return (
    <div className="panel">
      <div className="panel-title-row">
        <h2>Churn risk spotlight</h2>
        <span className="muted">High &amp; critical tiers</span>
      </div>
      <div className="table-wrap">
        <table className="data data-table--compact">
          <thead>
            <tr>
              <th>Member</th>
              <th>Gym</th>
              <th>Risk</th>
              <th>Last check-in</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m._id}>
                <td>
                  <div>{m.name}</div>
                  <div className="cell-sub">{m.email}</div>
                </td>
                <td>{m.gym?.name ?? '—'}</td>
                <td>
                  <span
                    className={`badge badge-${m.churnRiskTier === 'critical' ? 'critical' : 'high'}`}
                  >
                    {m.churnRiskTier}
                  </span>
                </td>
                <td>{formatDate(m.lastCheckinAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
