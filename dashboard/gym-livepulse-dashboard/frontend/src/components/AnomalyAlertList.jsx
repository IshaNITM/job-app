const typeLabels = {
  zero_checkins: 'Zero live attendance',
  capacity_breach: 'Capacity pressure',
  revenue_drop: 'Revenue drop',
};

const sevColors = {
  warning: 'var(--warn)',
  low: 'var(--muted)',
  medium: 'var(--warn)',
  high: 'var(--warn)',
  critical: 'var(--critical)',
};

export default function AnomalyAlertList({ anomalies }) {
  const list = anomalies ?? [];
  return (
    <div className="panel">
      <div className="panel-title-row">
        <h2>Live anomaly alerts</h2>
        <span className="muted">Rules evaluated on each refresh</span>
      </div>
      <ul className="anom-list">
        {list.length === 0 && (
          <li className="muted">No anomalies — all locations nominal.</li>
        )}
        {list.map((a) => (
          <li key={a._id} className="anom-item">
            <div
              className="anom-sev"
              style={{ background: sevColors[a.severity] || sevColors.medium }}
            />
            <div>
              <div className="anom-type">
                {typeLabels[a.type] || a.type}
                <span className="muted" style={{ marginLeft: '0.5rem' }}>
                  {a.gymId?.name}
                </span>
              </div>
              <p className="anom-msg">{a.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
