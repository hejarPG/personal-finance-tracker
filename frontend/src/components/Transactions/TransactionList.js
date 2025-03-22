import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Trash2 } from 'lucide-react';

const TransactionList = () => {
  const { transactions, deleteTransaction, categories, currency } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    type: 'all', // 'all', 'income', or 'expense'
    category: '', // category id or empty for all
  });
  
  // Format currency
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };
  
  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    const searchMatch = (
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Transaction type filter
    const typeMatch = filter.type === 'all' ||
      (filter.type === 'income' && transaction.amount > 0) ||
      (filter.type === 'expense' && transaction.amount < 0);
    
    // Category filter
    const categoryMatch = !filter.category || transaction.category === parseInt(filter.category);
    
    return searchMatch && typeMatch && categoryMatch;
  });
  
  // Handle transaction deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };
  
  // Find category name by id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get category color by id
  const getCategoryColor = (categoryId) => {
    if (!categoryId) return '#A0A0A0';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#A0A0A0';
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
      
      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
        <div>
          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transactions found. Try adjusting your filters or add a new transaction.
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.amount > 0;
                  const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                        {transaction.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {transaction.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{ 
                            backgroundColor: `${getCategoryColor(transaction.category)}20`, 
                            color: getCategoryColor(transaction.category) 
                          }}
                        >
                          {getCategoryName(transaction.category)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${amountClass}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList; 