import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useTransactions } from '../hooks/useTransactions';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './EditTransactionModal.css';

const categories = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Subscriptions', 'Salary', 'Freelance', 'Other'
];

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(50, 'Title is too long'),
  amount: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Amount is required')
    .positive('Amount must be positive'),
  category: yup.string().required('Category is required'),
  date: yup
    .date()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  notes: yup.string().max(200, 'Notes too long'),
  recurring: yup.boolean(),
});

const EditTransactionModal = ({ transaction, onClose }) => {
  const { updateTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...transaction,
      date: transaction?.date
        ? format(new Date(transaction.date), 'yyyy-MM-dd')
        : '',
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        ...transaction,
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      });
    }
  }, [transaction, reset]);

  const currentType = watch('type');

  const onSubmit = (data) => {
    updateTransaction({
      ...transaction,
      ...data,
      date: new Date(data.date).toISOString(),
    });
    toast.success('Transaction updated!', {
      icon: <FiCheckCircle style={{ color: 'var(--success)' }} />,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="modal-panel glass-card"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="modal-header">
            <h2 className="text-gradient">Edit Transaction</h2>
            <motion.button
              className="modal-close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="radio-group">
              <div
                className={`radio-btn ${currentType === 'income' ? 'active income' : ''}`}
                onClick={() => setValue('type', 'income')}
              >
                Income
              </div>
              <div
                className={`radio-btn ${currentType === 'expense' ? 'active expense' : ''}`}
                onClick={() => setValue('type', 'expense')}
              >
                Expense
              </div>
            </div>

            <div className="modal-form-grid">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="glass-input" {...register('title')} />
                {errors.title && (
                  <span className="form-error"><FiAlertCircle /> {errors.title.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" className="glass-input" {...register('amount')} />
                {errors.amount && (
                  <span className="form-error"><FiAlertCircle /> {errors.amount.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="glass-input" style={{ appearance: 'none' }} {...register('category')}>
                  {categories.map((c) => (
                    <option key={c} value={c} style={{ background: 'var(--bg-surface)' }}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <span className="form-error"><FiAlertCircle /> {errors.category.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="glass-input"
                  {...register('date')}
                  style={{ colorScheme: 'dark' }}
                />
                {errors.date && (
                  <span className="form-error"><FiAlertCircle /> {errors.date.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea className="glass-input" rows="2" {...register('notes')} />
              {errors.notes && (
                <span className="form-error"><FiAlertCircle /> {errors.notes.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input type="checkbox" {...register('recurring')} />
                <span style={{ color: 'var(--text-secondary)' }}>Mark as Recurring</span>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTransactionModal;
