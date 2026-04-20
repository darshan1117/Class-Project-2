import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { FiEdit3, FiCheck, FiX, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { BudgetProgressBar } from '../components/BudgetCard';
import './Budget.css';

const Budget = () => {
  const { budget, updateBudget, totalSpending, remainingBudget, percentageUsed } = useBudget();
  const { formatCurrency, selectedCurrency, setSelectedCurrency, currencies, loadingRates, ratesError } = useCurrency();
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(budget.monthlyBudget);

  const save = () => { const v=Number(temp); if(!isNaN(v)&&v>=0){ updateBudget(v); setEditing(false); }};
  const cancel = () => { setTemp(budget.monthlyBudget); setEditing(false); };

  const pct = Number(percentageUsed);
  const sc = pct>=90? 'danger' : pct>=70? 'warning' : 'safe';
  const msgs = {
    safe:    { icon: <FiCheckCircle />,   text: "You're on track! Keep up the great discipline." },
    warning: { icon: <FiAlertTriangle />, text: `${pct}% used — watch your spending this month.` },
    danger:  { icon: <FiXCircle />,       text: pct>=100 ? "Budget exceeded! Time to cut back." : "Almost at your limit — slow down!" },
  };

  return (
    <motion.div className="page-container" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      <div className="bgt-header">
        <div>
          <h1>Budget Tracker</h1>
          <p>Monitor your monthly spending limits.</p>
        </div>
        <div className="currency-switcher">
          <FiRefreshCw style={{ color: loadingRates ? 'var(--gold)' : 'var(--t3)', fontSize:13 }} />
          <span style={{ fontSize:11, color:'var(--t3)', fontWeight:600 }}>Currency</span>
          <select className="currency-select" value={selectedCurrency} onChange={e=>setSelectedCurrency(e.target.value)}>
            {currencies.map(c=><option key={c} value={c} style={{ background:'var(--bg-surface)' }}>{c}</option>)}
          </select>
          {ratesError && <span style={{ fontSize:10, color:'var(--amber)' }}>fallback</span>}
        </div>
      </div>

      <div className="bgt-body">
        
        <motion.div className="bgt-set-card" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}>
          <div className="bgt-set-top">
            <span className="bgt-set-label">Monthly Budget (INR base)</span>
            {!editing ? (
              <motion.button className="action-btn edit" onClick={()=>{ setTemp(budget.monthlyBudget); setEditing(true); }} whileHover={{ scale:1.1 }}>
                <FiEdit3 />
              </motion.button>
            ) : (
              <div style={{ display:'flex', gap:8 }}>
                <motion.button className="action-btn" style={{ color:'var(--green)', borderColor:'var(--green-border)' }} onClick={save} whileHover={{ scale:1.1 }}><FiCheck /></motion.button>
                <motion.button className="action-btn delete" onClick={cancel} whileHover={{ scale:1.1 }}><FiX /></motion.button>
              </div>
            )}
          </div>
          {editing ? (
            <input type="number" className="glass-input" value={temp} onChange={e=>setTemp(e.target.value)} autoFocus style={{ fontSize:28, fontWeight:700, maxWidth:260, fontFamily:"'Space Grotesk',sans-serif" }} />
          ) : (
            <div className="bgt-set-amount">{formatCurrency(budget.monthlyBudget)}</div>
          )}
        </motion.div>

        <div className="bgt-stats">
          {[
            { lbl:'Spent This Month', val:formatCurrency(totalSpending),   sc },
            { lbl:'Remaining',        val:formatCurrency(remainingBudget), sc },
            { lbl:'Utilisation',      val:`${pct}%`,                       sc },
          ].map((s,i) => (
            <motion.div key={i} className="bgt-stat" initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15+i*0.07 }}>
              <span className="bgt-stat-lbl">{s.lbl}</span>
              <div className={`bgt-stat-val ${s.sc}`}>{s.val}</div>
            </motion.div>
          ))}
        </div>

        <motion.div className="bgt-progress-card" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.32 }}>
          <div className="bgt-prog-top">
            <span className="bgt-prog-title">Budget Utilisation</span>
            <span className={`bgt-prog-pct ${sc==='safe'?'':''}` } style={{ color: sc==='danger'?'var(--red)':sc==='warning'?'var(--amber)':'var(--green)' }}>{pct}%</span>
          </div>
          <div className="bgt-prog-track">
            <motion.div
              className={`bgt-prog-fill ${sc}`}
              initial={{ width:0 }}
              animate={{ width:`${Math.min(pct,100)}%` }}
              transition={{ duration:0.9, ease:'easeOut' }}
            />
          </div>
          <div className="bgt-prog-meta">
            <span>Spent: {formatCurrency(totalSpending)}</span>
            <span>Limit: {formatCurrency(budget.monthlyBudget)}</span>
          </div>
          <div className={`bgt-status ${sc}`}>
            {msgs[sc].icon}
            <span>{msgs[sc].text}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Budget;
