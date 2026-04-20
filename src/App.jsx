import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <TopNav />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"        element={<PageWrap><Dashboard /></PageWrap>} />
            <Route path="/transactions"     element={<PageWrap><Transactions /></PageWrap>} />
            <Route path="/transactions/new" element={<PageWrap><AddTransaction /></PageWrap>} />
            <Route path="/budget"           element={<PageWrap><Budget /></PageWrap>} />
            <Route path="/analytics"        element={<PageWrap><Analytics /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </main>
      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastStyle={{
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border-hover)',
          borderRadius: '12px',
          color: 'var(--t1)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
    </div>
  );
}

export default App;
