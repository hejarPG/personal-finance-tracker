import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/token/`, { username, password });
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', username);
    }
    return response.data;
  },
  register: async (username, email, password, currency) => {
    const response = await axios.post(`${API_URL}/register/`, { 
      username, 
      email, 
      password,
      password2: password,
      currency
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
  },
  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    return response.data;
  },
  getCurrentUser: () => {
    return localStorage.getItem('username');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Transaction services
export const transactionService = {
  getAllTransactions: async (params = {}) => {
    const response = await api.get('/transactions/', { params });
    return response.data;
  },
  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}/`);
    return response.data;
  },
  createTransaction: async (transaction) => {
    const response = await api.post('/transactions/', transaction);
    return response.data;
  },
  updateTransaction: async (id, transaction) => {
    const response = await api.put(`/transactions/${id}/`, transaction);
    return response.data;
  },
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}/`);
    return response.data;
  },
  getBalance: async () => {
    const response = await api.get('/transactions/balance/');
    return response.data;
  },
  getCategorySummary: async () => {
    const response = await api.get('/transactions/category_summary/');
    return response.data;
  },
  getBalanceHistory: async () => {
    const response = await api.get('/transactions/balance_history/');
    return response.data;
  },
  exportCSV: async () => {
    try {
      console.log('Starting CSV export...');
      
      // Use the api instance which already has the auth token
      const response = await api.get('/transactions/export_csv/', { 
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      
      console.log('CSV response received:', response.status);
      
      // Create file from response
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('CSV export completed');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file. Please try again.');
    }
  },
  exportExcel: async () => {
    try {
      console.log('Starting Excel export with authenticated request...');
      
      // Use the api instance which already has auth headers properly set
      const response = await api.get('/transactions/export_excel/', {
        responseType: 'blob',
        headers: {
          // Override content type for file download
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      
      console.log('Response received:', response.status);
      
      // Create file from the response
      const contentType = 'application/vnd.ms-excel';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      // Create and trigger download link
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Excel export completed');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    }
  }
};

// Category services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },
  createCategory: async (category) => {
    const response = await api.post('/categories/', category);
    return response.data;
  },
  updateCategory: async (id, category) => {
    const response = await api.put(`/categories/${id}/`, category);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}/`);
    return response.data;
  }
};

export default api; 