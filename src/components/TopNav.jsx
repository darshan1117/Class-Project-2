import { NavLink } from 'react-router-dom';
import {
  FiPieChart, FiList, FiPlusCircle, FiTarget, FiBarChart2,
  FiZap
} from 'react-icons/fi';
import './TopNav.css';

const navItems = [
  { path: '/dashboard',        label: 'Dashboard',   icon: <FiPieChart /> },
  { path: '/transactions',     label: 'Transactions', icon: <FiList /> },
  { path: '/transactions/new', label: 'Add New',      icon: <FiPlusCircle /> },
  { path: '/budget',           label: 'Budget',       icon: <FiTarget /> },
  { path: '/analytics',        label: 'Analytics',    icon: <FiBarChart2 /> },
];

const TopNav = () => (
  <header className="topnav">
    
    <div className="topnav-brand">
      <div className="brand-mark">
        <FiZap className="brand-icon" />
      </div>
      <span className="brand-name">FinFlow</span>
    </div>

    <nav className="topnav-links">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}
        >
          <span className="tnl-icon">{item.icon}</span>
          <span className="tnl-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="topnav-right">
      <div className="nav-badge">Live Rates ✦</div>
    </div>
  </header>
);

export default TopNav;
