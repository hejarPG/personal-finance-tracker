import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import AddTransaction from './Transactions/AddTransaction';
import TransactionList from './Transactions/TransactionList';
import BalanceCard from './Balance/BalanceCard';
import Charts from './Charts/Charts';
import CategoryManager from './Categories/CategoryManager';
import { ArrowDownCircle, ArrowUpCircle, FileText, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { 
    balance, 
    currency, 
    exportTransactionsCSV, 
    exportTransactionsExcel,
    loading, 
    error 
  } = useFinance();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transactions');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Personal Finance Tracker</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <User size={18} className="mr-1" />
              <span>{user?.username || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Current Balance */}
        <BalanceCard balance={balance} currency={currency} />
        
        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
            
            <div className="flex-grow"></div>
            
            <div className="py-2">
              <button
                onClick={exportTransactionsCSV}
                className="inline-flex items-center mr-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText size={16} className="mr-1" />
                Export CSV
              </button>
              <button
                onClick={exportTransactionsExcel}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText size={16} className="mr-1" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'transactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AddTransaction />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <Charts />
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div>
              <CategoryManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 