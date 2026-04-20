import React from 'react';
import { motion } from 'framer-motion';
import './Filters.css';

const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions', 'Salary', 'Freelance', 'Other'];

const Filters = ({ filters, onFiltersChange }) => {
  const set = (key, value) => onFiltersChange({ ...filters, [key]: value });

  return (
    <motion.div
      className="filters-wrapper"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <select
        className="glass-input filter-select"
        value={filters.type}
        onChange={(e) => set('type', e.target.value)}
      >
        <option value="all" style={{ background: 'var(--bg-surface)' }}>All Types</option>
        <option value="income" style={{ background: 'var(--bg-surface)' }}>Income</option>
        <option value="expense" style={{ background: 'var(--bg-surface)' }}>Expense</option>
      </select>

      <select
        className="glass-input filter-select"
        value={filters.category}
        onChange={(e) => set('category', e.target.value)}
      >
        {categories.map(c => (
          <option key={c} value={c} style={{ background: 'var(--bg-surface)' }}>
            {c === 'All' ? 'All Categories' : c}
          </option>
        ))}
      </select>

      <select
        className="glass-input filter-select"
        value={filters.sortBy}
        onChange={(e) => set('sortBy', e.target.value)}
      >
        <option value="date-desc" style={{ background: 'var(--bg-surface)' }}>Date (Newest First)</option>
        <option value="date-asc" style={{ background: 'var(--bg-surface)' }}>Date (Oldest First)</option>
        <option value="amount-desc" style={{ background: 'var(--bg-surface)' }}>Amount (Highest)</option>
        <option value="amount-asc" style={{ background: 'var(--bg-surface)' }}>Amount (Lowest)</option>
        <option value="category" style={{ background: 'var(--bg-surface)' }}>Category (A-Z)</option>
      </select>

      <div className="date-range-group">
        <input
          type="date"
          className="glass-input date-input"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
          title="From date"
          style={{ colorScheme: 'dark' }}
        />
        <span className="date-separator">→</span>
        <input
          type="date"
          className="glass-input date-input"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
          title="To date"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {(filters.type !== 'all' || filters.category !== 'All' || filters.dateFrom || filters.dateTo) && (
        <motion.button
          className="btn-ghost clear-filters"
          onClick={() => onFiltersChange({ type: 'all', category: 'All', sortBy: 'date-desc', dateFrom: '', dateTo: '' })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Clear Filters
        </motion.button>
      )}
    </motion.div>
  );
};

export default Filters;
