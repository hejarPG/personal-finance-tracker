import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Trash2, Plus, Edit2 } from 'lucide-react';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense', color: '#6366f1' });
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Available colors for categories
  const colorOptions = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#14b8a6', // Teal
    '#0ea5e9', // Sky
    '#3b82f6', // Blue
    '#6b7280', // Gray
    '#000000', // Black
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
    setError('');
  };

  const handleColorSelect = (color) => {
    setNewCategory({
      ...newCategory,
      color,
    });
  };

  const handleTypeChange = (type) => {
    setNewCategory({
      ...newCategory,
      type,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editMode && currentCategory) {
        await updateCategory(currentCategory.id, newCategory);
        setSuccess('Category updated successfully');
      } else {
        await addCategory(newCategory);
        setSuccess('Category added successfully');
      }
      
      // Reset form after successful submission
      setNewCategory({ name: '', type: 'expense', color: '#6366f1' });
      setEditMode(false);
      setCurrentCategory(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setNewCategory({
      name: category.name,
      type: category.type,
      color: category.color,
    });
    setCurrentCategory(category);
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All transactions under this category will be affected.')) {
      try {
        await deleteCategory(id);
        setSuccess('Category deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (error) {
        setError(error.message || 'Failed to delete category');
      }
    }
  };

  const handleCancel = () => {
    setNewCategory({ name: '', type: 'expense', color: '#6366f1' });
    setEditMode(false);
    setCurrentCategory(null);
    setError('');
  };
  
  // Filter categories by type
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Manage Categories</h2>
      
      {/* Form for adding/editing categories */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Groceries"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Type</label>
          <div className="mt-1 flex space-x-4">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                newCategory.type === 'expense'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                newCategory.type === 'income'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Income
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Color</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  newCategory.color === color ? 'border-gray-900' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editMode ? 'Update Category' : 'Add Category'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Category Lists */}
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Expense Categories</h3>
          {expenseCategories.length === 0 ? (
            <p className="text-sm text-gray-500">No expense categories. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {expenseCategories.map((category) => (
                <li key={category.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Income Categories</h3>
          {incomeCategories.length === 0 ? (
            <p className="text-sm text-gray-500">No income categories. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {incomeCategories.map((category) => (
                <li key={category.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager; 