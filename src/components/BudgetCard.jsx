import React from 'react';
import { motion } from 'framer-motion';
import './BudgetCard.css';

const BudgetCard = ({ label, value, statusClass, children }) => (
  <motion.div
    className="glass-card budget-stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
  >
    <span className="bcard-label">{label}</span>
    <span className={`bcard-value ${statusClass || ''}`}>{value}</span>
    {children}
  </motion.div>
);

export const BudgetProgressBar = ({ percentageUsed, statusClass }) => (
  <div className="progress-bar-bg">
    <motion.div
      className={`progress-bar-fill ${statusClass}`}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
);

export default BudgetCard;
