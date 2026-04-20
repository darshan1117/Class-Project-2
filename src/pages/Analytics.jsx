import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { format, parseISO } from 'date-fns';
import { FiBarChart2 } from 'react-icons/fi';
import CategoryPieChart from '../components/Charts/CategoryPieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';
import TrendLineChart from '../components/Charts/TrendLineChart';
import './Analytics.css';

const Analytics = () => {
  const { transactions } = useTransactions();
  const { formatCurrency } = useCurrency();

  const { categoryData, barData, lineData } = useMemo(() => {
    const catTotals={}, mIncome={}, mExpense={}, daily={};
    transactions.forEach(t => {
      const amt = Number(t.amount);
      const mo  = format(parseISO(t.date), 'MMM yyyy');
      const day = format(parseISO(t.date), 'MMM dd');
      if (t.type==='expense') { catTotals[t.category]=(catTotals[t.category]||0)+amt; mExpense[mo]=(mExpense[mo]||0)+amt; daily[day]=(daily[day]||0)+amt; }
      else { mIncome[mo]=(mIncome[mo]||0)+amt; }
    });
    const categoryData = Object.entries(catTotals).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
    const allMo = Array.from(new Set([...Object.keys(mIncome),...Object.keys(mExpense)])).sort((a,b)=>new Date(a)-new Date(b));
    const barData = allMo.map(m=>({ name:m, Income:mIncome[m]||0, Expense:mExpense[m]||0 }));
    const days = Object.keys(daily).sort((a,b)=>new Date(a+' '+new Date().getFullYear())-new Date(b+' '+new Date().getFullYear()));
    const lineData = days.map(d=>({ name:d, amount:daily[d]||0 }));
    return { categoryData, barData, lineData };
  }, [transactions]);

  return (
    <motion.div className="page-container" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      <div className="ana-header">
        <div>
          <h1>Analytics</h1>
          <p>Deep insights into your spending habits and trends.</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="ana-empty">
          <FiBarChart2 className="ana-empty-icon" />
          <h3>No data yet</h3>
          <p>Add some transactions to generate analytics.</p>
        </div>
      ) : (
        <div className="charts-grid">
          <motion.div className="chart-card" initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}>
            <div className="chart-title">Spending by Category</div>
            <div className="chart-container">
              <CategoryPieChart data={categoryData} formatCurrency={formatCurrency} />
            </div>
          </motion.div>

          <motion.div className="chart-card" initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.18 }}>
            <div className="chart-title">Income vs Expenses</div>
            <div className="chart-container">
              <MonthlyBarChart data={barData} formatCurrency={formatCurrency} />
            </div>
          </motion.div>

          <motion.div className="chart-card full-width" initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.26 }}>
            <div className="chart-title">Daily Expense Trend</div>
            <div className="chart-container" style={{ height:320 }}>
              <TrendLineChart data={lineData} formatCurrency={formatCurrency} />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
export default Analytics;
