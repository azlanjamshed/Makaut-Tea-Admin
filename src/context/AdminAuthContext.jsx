import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('rant_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('rant_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const storedToken = localStorage.getItem('rant_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authApi.getAdminMe();
        if (res.success && res.data) {
          if (res.data.role !== 'admin') {
            throw new Error('Access denied: Admin role required');
          }
          setAdmin(res.data);
          localStorage.setItem('rant_admin_user', JSON.stringify(res.data));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    if (res.success && res.token) {
      if (res.data?.role !== 'admin') {
        throw new Error('Access denied: You do not have administrator permissions.');
      }
      localStorage.setItem('rant_admin_token', res.token);
      localStorage.setItem('rant_admin_user', JSON.stringify(res.data));
      setToken(res.token);
      setAdmin(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Authentication failed');
  };

  const logout = () => {
    localStorage.removeItem('rant_admin_token');
    localStorage.removeItem('rant_admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(token && admin),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
