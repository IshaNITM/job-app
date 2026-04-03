import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import GymDetails from './pages/GymDetails.jsx';
import Members from './pages/Members.jsx';
import './App.css';

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <strong>Gym LivePulse</strong>
            <span className="brand-sub">Operations dashboard</span>
          </div>
        </div>
        <nav className="nav">
          <NavLink end className={({ isActive }) => (isActive ? 'active' : '')} to="/">
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/members">
            Members
          </NavLink>
        </nav>
      </header>

      <main className="main" id="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gym/:id" element={<GymDetails />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </main>
    </div>
  );
}
