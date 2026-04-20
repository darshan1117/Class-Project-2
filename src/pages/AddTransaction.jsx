import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft, FiRepeat } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AddTransaction.css';

const cats = ['Food','Travel','Rent','Shopping','Entertainment','Health','Utilities','Subscriptions','Salary','Freelance','Other'];

const schema = yup.object({
  title:     yup.string().required('Required').max(50,'Too long'),
  amount:    yup.number().transform(v=>isNaN(v)?null:v).nullable().required('Required').positive('Must be positive'),
  category:  yup.string().required('Required'),
  date:      yup.date().transform((v,o)=>o===''?null:v).nullable().required('Required').max(new Date(),'Cannot be future'),
  type:      yup.string().oneOf(['income','expense']).required(),
  notes:     yup.string().max(200,'Too long'),
  recurring: yup.boolean(),
});

const AddTransaction = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState:{ errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type:'expense', recurring:false, date: new Date().toISOString().split('T')[0] },
  });
  const type = watch('type');

  const onSubmit = (data) => {
    addTransaction({ ...data, id: uuidv4(), date: new Date(data.date).toISOString() });
    toast.success('Transaction added!');
    navigate('/transactions');
  };

  return (
    <motion.div className="page-container" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      <div className="atx-wrap">
        <button className="atx-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="atx-head">
          <h1>Add Transaction</h1>
          <p>Record a new income or expense entry.</p>
        </div>

        <div className="atx-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="radio-group">
              <div className={`radio-btn ${type==='income' ? 'active income' : ''}`} onClick={() => setValue('type','income')}>+ Income</div>
              <div className={`radio-btn ${type==='expense' ? 'active expense' : ''}`} onClick={() => setValue('type','expense')}>− Expense</div>
            </div>

            <div className="atx-grid2">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="glass-input" placeholder="e.g. Monthly Salary" {...register('title')} />
                {errors.title && <span className="form-error"><FiAlertCircle /> {errors.title.message}</span>}
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" step="0.01" className="glass-input" placeholder="0.00" {...register('amount')} />
                {errors.amount && <span className="form-error"><FiAlertCircle /> {errors.amount.message}</span>}
              </div>
            </div>

            <div className="atx-grid2">
              <div className="form-group">
                <label>Category</label>
                <select className="glass-input" {...register('category')}>
                  <option value="">Select category</option>
                  {cats.map(c => <option key={c} value={c} style={{ background:'var(--bg-surface)' }}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error"><FiAlertCircle /> {errors.category.message}</span>}
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="glass-input" {...register('date')} style={{ colorScheme:'dark' }} />
                {errors.date && <span className="form-error"><FiAlertCircle /> {errors.date.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Notes <span style={{ color:'var(--t3)', fontWeight:400 }}>(optional)</span></label>
              <textarea className="glass-input" rows="3" placeholder="Any extra details..." {...register('notes')} style={{ resize:'vertical' }} />
            </div>

            <label className="checkbox-group">
              <input type="checkbox" {...register('recurring')} />
              <FiRepeat style={{ color:'var(--gold)', flexShrink:0 }} />
              <span style={{ color:'var(--t2)' }}>Mark as recurring transaction</span>
            </label>

            <div className="atx-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/transactions')}>Cancel</button>
              <motion.button type="submit" className="btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} disabled={isSubmitting}>
                <FiCheckCircle /> Save Transaction
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
export default AddTransaction;
