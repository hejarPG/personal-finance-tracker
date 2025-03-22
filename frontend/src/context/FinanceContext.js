import React, { createContext, useContext, useState, useEffect } from 'react';
import { transactionService, categoryService } from '../api/api';

// Create context
const FinanceContext = createContext();

// Create provider component
export const FinanceProvider = ({ children }) => {
  // Initialize state variables
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories, transactions, and balance in parallel
        const [categoriesData, transactionsData, balanceData, summaryData, historyData] = await Promise.all([
          categoryService.getAllCategories(),
          transactionService.getAllTransactions(),
          transactionService.getBalance(),
          transactionService.getCategorySummary(),
          transactionService.getBalanceHistory()
        ]);

        setCategories(categoriesData);
        setTransactions(transactionsData);
        setBalance(balanceData.balance);
        setCurrency(balanceData.currency);
        setCategorySummary(summaryData);
        setBalanceHistory(historyData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTransaction = await transactionService.createTransaction(transactionData);
      
      // Update transactions list
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      // Update balance
      const newBalance = await transactionService.getBalance();
      setBalance(newBalance.balance);
      
      // Update charts
      const [summaryData, historyData] = await Promise.all([
        transactionService.getCategorySummary(),
        transactionService.getBalanceHistory()
      ]);
      
      setCategorySummary(summaryData);
      setBalanceHistory(historyData);
      
      return newTransaction;
    } catch (err) {
      setError(err.message || 'Failed to add transaction');
      console.error('Error adding transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a transaction
  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await transactionService.deleteTransaction(id);
      
      // Update transactions list
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
      
      // Update balance and charts
      const [newBalance, summaryData, historyData] = await Promise.all([
        transactionService.getBalance(),
        transactionService.getCategorySummary(),
        transactionService.getBalanceHistory()
      ]);
      
      setBalance(newBalance.balance);
      setCategorySummary(summaryData);
      setBalanceHistory(historyData);
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new category
  const addCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCategory = await categoryService.createCategory(categoryData);
      
      // Update categories list
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      return newCategory;
    } catch (err) {
      setError(err.message || 'Failed to add category');
      console.error('Error adding category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a category
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await categoryService.deleteCategory(id);
      
      // Update categories list
      setCategories(prevCategories => 
        prevCategories.filter(category => category.id !== id)
      );
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a category
  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      
      // Update categories list
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      
      return updatedCategory;
    } catch (err) {
      setError(err.message || 'Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to export transactions as CSV
  const exportTransactionsCSV = async () => {
    try {
      await transactionService.exportCSV();
    } catch (err) {
      setError(err.message || 'Failed to export transactions as CSV');
      console.error('Error exporting as CSV:', err);
      throw err;
    }
  };

  // Function to export transactions as Excel
  const exportTransactionsExcel = async () => {
    try {
      await transactionService.exportExcel();
    } catch (err) {
      setError(err.message || 'Failed to export transactions as Excel');
      console.error('Error exporting as Excel:', err);
      throw err;
    }
  };

  // Context value to provide
  const value = {
    transactions,
    categories,
    balance,
    currency,
    setCurrency,
    loading,
    error,
    categorySummary,
    balanceHistory,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    updateCategory,
    exportTransactionsCSV,
    exportTransactionsExcel
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext; 