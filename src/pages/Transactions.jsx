import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import { useDebounce } from '../hooks/useDebounce';
import { FiSearch, FiPlusCircle } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import TransactionCard from '../components/TransactionCard';
import EditTransactionModal from '../components/EditTransactionModal';
import './Transactions.css';

const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState({ type:'all', category:'All', sortBy:'date-desc', dateFrom:'', dateTo:'' });
  const [editTx, setEditTx] = useState(null);

  const list = useMemo(() => {
    let r = [...transactions];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      r = r.filter(t => t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q)));
    }
    if (filters.type !== 'all')     r = r.filter(t => t.type === filters.type);
    if (filters.category !== 'All') r = r.filter(t => t.category === filters.category);
    if (filters.dateFrom) r = r.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    if (filters.dateTo)   { const d = new Date(filters.dateTo); d.setHours(23,59,59,999); r = r.filter(t => new Date(t.date) <= d); }
    r.sort((a,b) => {
      if (filters.sortBy==='date-desc')   return new Date(b.date)-new Date(a.date);
      if (filters.sortBy==='date-asc')    return new Date(a.date)-new Date(b.date);
      if (filters.sortBy==='amount-desc') return b.amount-a.amount;
      if (filters.sortBy==='amount-asc')  return a.amount-b.amount;
      if (filters.sortBy==='category')    return a.category.localeCompare(b.category);
      return 0;
    });
    return r;
  }, [transactions, debouncedSearch, filters]);

  return (
    <div className="page-container">
      <div className="tx-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage and review all your financial records.</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span className="tx-count">{list.length} / {transactions.length}</span>
          <Link to="/transactions/new" className="btn-primary" style={{ textDecoration:'none' }}>
            <FiPlusCircle /> Add New
          </Link>
        </div>
      </div>

      <div className="tx-filter-bar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by title or notes..." />
        <Filters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="tx-list">
        <AnimatePresence mode="popLayout">
          {list.length > 0 ? list.map((t,i) => (
            <TransactionCard key={t.id} transaction={t} index={i} onEdit={setEditTx} onDelete={deleteTransaction} formatCurrency={formatCurrency} />
          )) : (
            <motion.div key="empty" className="tx-empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <FiSearch style={{ fontSize:40, opacity:.3, display:'block', margin:'0 auto 14px' }} />
              <h3>No transactions found</h3>
              <p>Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editTx && <EditTransactionModal transaction={editTx} onClose={() => setEditTx(null)} />}
      </AnimatePresence>
    </div>
  );
};
export default Transactions;
