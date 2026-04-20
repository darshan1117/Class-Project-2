
import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('fin_budget');
    return saved ? JSON.parse(saved) : { monthlyBudget: 50000 };
  });

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) => 
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (newBudget) => {
    setBudget({ monthlyBudget: newBudget });
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateBudget
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
