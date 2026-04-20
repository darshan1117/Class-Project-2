import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { format } from 'date-fns';
import {
  FiTrendingUp, FiTrendingDown, FiStar,
  FiArrowRight, FiPlusCircle, FiArrowUpRight, FiArrowDownLeft, FiRepeat, FiActivity
} from 'react-icons/fi';
import './Dashboard.css';

const cardIn = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' },
});

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { formatCurrency } = useCurrency();

  const { income, expense, netBalance, topCategory, recurringCount, categoryData } = useMemo(() => {
    let income = 0, expense = 0, recurringCount = 0;
    const cat = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'income') income += amt;
      else {
        expense += amt;
        cat[t.category] = (cat[t.category] || 0) + amt;
      }
      if (t.recurring) recurringCount++;
    });
    let topCategory = 'None', max = 0;
    const categoryData = Object.entries(cat).sort((a, b) => b[1] - a[1]).slice(0, 4);
    for (const [c, a] of Object.entries(cat)) if (a > max) { max = a; topCategory = c; }
    return { income, expense, netBalance: income - expense, topCategory, recurringCount, categoryData };
  }, [transactions]);

  const recent = transactions.slice(0, 6);

  return (
    <div className="db-page">

      <div className="db-row1">

        <motion.div className="db-hero" {...cardIn(0)}>
          <div className="db-hero-eyebrow">
            <span className="chip chip-gold"><FiActivity style={{ fontSize: 10 }} /> Net Balance</span>
            <span className="db-hero-count">{transactions.length} transactions</span>
          </div>
          <div className="db-hero-amount">{formatCurrency(netBalance)}</div>
          <div className="db-hero-sub">
            <div className="db-hero-sub-item">
              <span>Income</span>
              <strong style={{ color: 'var(--green)' }}>{formatCurrency(income)}</strong>
            </div>
            <div className="db-hero-divider" />
            <div className="db-hero-sub-item">
              <span>Expenses</span>
              <strong style={{ color: 'var(--red)' }}>{formatCurrency(expense)}</strong>
            </div>
            <div className="db-hero-divider" />
            <div className="db-hero-sub-item">
              <span>Recurring</span>
              <strong style={{ color: 'var(--amber)' }}>{recurringCount}</strong>
            </div>
          </div>
          <Link to="/transactions/new" className="db-hero-cta">
            <FiPlusCircle /> Add Transaction
          </Link>
        </motion.div>

        <div className="db-mini-col">
          {[
            { label: 'Total Income',   value: formatCurrency(income),   icon: <FiTrendingUp />,   cls: 'card-green', iconCls: 'icon-green' },
            { label: 'Total Expenses', value: formatCurrency(expense),  icon: <FiTrendingDown />, cls: 'card-red',   iconCls: 'icon-red'  },
            { label: 'Top Category',   value: topCategory,              icon: <FiStar />,         cls: 'card-gold',  iconCls: 'icon-gold', small: true },
          ].map((s, i) => (
            <motion.div key={s.label} className={`card db-mini-card ${s.cls}`} {...cardIn(0.1 + i * 0.08)}>
              <div className={`db-mini-icon ${s.iconCls}`}>{s.icon}</div>
              <div>
                <div className="db-mini-label">{s.label}</div>
                <div className={`db-mini-value ${s.small ? 'db-mini-value--sm' : ''}`}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="db-row2">

        <motion.div className="card db-recent" {...cardIn(0.3)}>
          <div className="db-section-head">
            <h2 className="db-section-title">Recent Activity</h2>
            <Link to="/transactions" className="db-link">All transactions <FiArrowRight /></Link>
          </div>
          <div className="db-tx-list">
            <AnimatePresence>
              {recent.length > 0 ? recent.map((t, i) => (
                <motion.div
                  key={t.id}
                  className="db-tx-row"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  <div className={`db-tx-dot ${t.type}`}>
                    {t.type === 'income' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                  </div>
                  <div className="db-tx-info">
                    <span className="db-tx-title">
                      {t.title}
                      {t.recurring && <FiRepeat className="db-tx-recurring" title="Recurring" />}
                    </span>
                    <span className="db-tx-meta">
                      <span className="db-tx-cat">{t.category}</span>
                      <span>·</span>
                      <span>{format(new Date(t.date), 'MMM d')}</span>
                    </span>
                  </div>
                  <span className={`db-tx-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                  </span>
                </motion.div>
              )) : (
                <div className="empty" style={{ padding: '40px 0' }}>
                  <p>No transactions yet.</p>
                  <Link to="/transactions/new" className="btn-primary" style={{ textDecoration: 'none', marginTop: 14, display: 'inline-flex' }}>
                    <FiPlusCircle /> Add first
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="card db-spend" {...cardIn(0.38)}>
          <div className="db-section-head">
            <h2 className="db-section-title">Spend by Category</h2>
            <Link to="/analytics" className="db-link">Full analytics <FiArrowRight /></Link>
          </div>

          {categoryData.length > 0 ? (
            <div className="db-cat-list">
              {categoryData.map(([cat, amt], i) => {
                const pct = expense > 0 ? Math.round((amt / expense) * 100) : 0;
                const colors = ['var(--gold)', 'var(--green)', 'var(--red)', 'var(--blue)'];
                return (
                  <div key={cat} className="db-cat-row">
                    <div className="db-cat-info">
                      <span className="db-cat-name">{cat}</span>
                      <span className="db-cat-amt">{formatCurrency(amt)}</span>
                    </div>
                    <div className="db-cat-bar-track">
                      <motion.div
                        className="db-cat-bar-fill"
                        style={{ background: colors[i % colors.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                    <span className="db-cat-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty" style={{ padding: '40px 0' }}>
              <p>Add expense transactions to see breakdown.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
