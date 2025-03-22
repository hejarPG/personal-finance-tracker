import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const AddTransaction = () => {
  const { categories, addTransaction, currency } = useFinance();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    type: 'expense', // Default to expense
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Format amount based on transaction type
      const amount = formData.type === 'income' 
        ? Math.abs(parseFloat(formData.amount))
        : -Math.abs(parseFloat(formData.amount));
      
      // Prepare transaction data
      const transactionData = {
        title: formData.title,
        description: formData.description || null,
        amount: amount,
        category: formData.category || null,
      };
      
      // Add transaction
      await addTransaction(transactionData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: '',
        type: 'expense',
      });
      
      setSuccess('Transaction added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format currency for input placeholder
  const formatCurrencySymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'INR': return '₹';
      default: return '$';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add Transaction</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Transaction Type Toggle */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                formData.type === 'expense'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              <ArrowDownCircle size={16} className="mr-1" />
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                formData.type === 'income'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
              onClick={() => handleTypeChange('income')}
            >
              <ArrowUpCircle size={16} className="mr-1" />
              Income
            </button>
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{formatCurrencySymbol()}</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
        
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.type === 'expense'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {loading ? 'Adding...' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction; 