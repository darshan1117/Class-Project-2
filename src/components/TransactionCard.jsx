import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiArrowDownLeft, FiArrowUpRight, FiRepeat, FiTrash2, FiEdit2 } from 'react-icons/fi';
import './TransactionCard.css';

const TransactionCard = ({ transaction: t, onEdit, onDelete, showActions = true, index = 0, formatCurrency }) => {
  const fmt = formatCurrency || ((v) => `₹${Number(v).toLocaleString('en-IN')}`);

  return (
    <motion.div
      className="tc-card glass-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      layout
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
    >
      <div className="tc-left">
        <div className={`tc-icon ${t.type}`}>
          {t.type === 'income' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
        </div>
        <div className="tc-details">
          <h3>
            {t.title}
            {t.recurring && (
              <FiRepeat className="recurring-badge" title="Recurring" />
            )}
          </h3>
          <p>
            <span className="tc-category">{t.category}</span>
            <span className="separator">•</span>
            <span>{format(new Date(t.date), 'MMM dd, yyyy')}</span>
            {t.notes && (
              <>
                <span className="separator">•</span>
                <span className="tc-notes">{t.notes}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="tc-right">
        <div className={`tc-amount ${t.type}`}>
          {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
        </div>
        {showActions && (
          <div className="tc-actions">
            {onEdit && (
              <motion.button
                className="action-btn edit"
                onClick={() => onEdit(t)}
                title="Edit"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit2 />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                className="action-btn delete"
                onClick={() => onDelete(t.id)}
                title="Delete"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTrash2 />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionCard;
