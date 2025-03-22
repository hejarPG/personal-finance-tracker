import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/api';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  // Initialize state variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const username = localStorage.getItem('username');
        setIsAuthenticated(true);
        setUser({ username: username || 'User' });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.login(username, password);
      
      setIsAuthenticated(true);
      setUser({ username });
      localStorage.setItem('username', username);
      
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password, currency) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.register(username, email, password, currency);
      
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Context value to provide
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 