import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { useTransactions } from './useTransactions';

export const useBudget = () => {
  const context = useContext(FinanceContext);
  const { transactions } = useTransactions();
  
  if (!context) {
    throw new Error('useBudget must be used within a FinanceProvider');
  }

  const { budget, updateBudget } = context;

  const { totalSpending, remainingBudget, percentageUsed } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = transactions.filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const total = monthlyExpenses.reduce((acc, t) => acc + Number(t.amount), 0);
    const remaining = budget.monthlyBudget - total;
    const percentage = budget.monthlyBudget > 0 ? (total / budget.monthlyBudget) * 100 : 0;

    return {
      totalSpending: total,
      remainingBudget: remaining,
      percentageUsed: Math.min(percentage, 100).toFixed(1)
    };
  }, [transactions, budget.monthlyBudget]);

  return {
    budget,
    updateBudget,
    totalSpending,
    remainingBudget,
    percentageUsed
  };
};
