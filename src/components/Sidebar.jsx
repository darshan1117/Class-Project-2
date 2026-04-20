import { NavLink } from 'react-router-dom';
import { FiPieChart, FiList, FiPlusCircle, FiTarget, FiBarChart2, FiZap } from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard',       label: 'Dashboard',    icon: <FiPieChart /> },
  { path: '/transactions',    label: 'Transactions',  icon: <FiList /> },
  { path: '/transactions/new',label: 'Add New',       icon: <FiPlusCircle /> },
  { path: '/budget',          label: 'Budget',        icon: <FiTarget /> },
  { path: '/analytics',       label: 'Analytics',     icon: <FiBarChart2 /> },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <div className="logo-icon">
        <div className="logo-circle" />
      </div>
      <h2>FinFlow</h2>
    </div>

    <p className="sidebar-section-label">Main Menu</p>

    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/transactions/new' ? false : item.path !== '/transactions'}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-footer">
      <div className="sidebar-footer-info">
        <p><FiZap style={{ display: 'inline', marginRight: 5 }} />Live exchange rates</p>
        <span>Powered by ExchangeRate API</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
