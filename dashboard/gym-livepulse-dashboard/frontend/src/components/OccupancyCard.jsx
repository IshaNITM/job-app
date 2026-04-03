import { Link } from 'react-router-dom';
import './OccupancyCard.css';

export default function OccupancyCard({ gym, occupancy }) {
  const cap = gym.capacity || 1;
  const open = occupancy?.openSessions ?? 0;
  const pct = Math.min(100, Math.round((open / cap) * 100));

  return (
    <article className="occ-card panel">
      <Link className="occ-card__link" to={`/gym/${gym._id}`}>
        <h3>{gym.name}</h3>
        <p className="occ-card__city">{gym.city}</p>
        <div className="occ-card__stats">
          <span>
            <strong>{open}</strong>
            <small>open</small>
          </span>
          <span>
            <strong>{gym.memberCount ?? '—'}</strong>
            <small>members</small>
          </span>
        </div>
        <div className="occ-bar" title={`${pct}% of capacity`}>
          <div className="occ-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <footer className="occ-card__foot">
          {pct}% of {cap} capacity
        </footer>
      </Link>
    </article>
  );
}
