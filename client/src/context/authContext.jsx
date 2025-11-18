import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // fetch user details if we have a token but no user object
      if (!user) {
        axios.get('http://127.0.0.1:5000/api/auth/me')
          .then(res => {
            if (res.data) {
              setUser(res.data.user);
            } else {
              // Token is invalid
              setToken(null);
            }
          })
          .catch(() => {
            // Failed to fetch user, clear token
            setToken(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token, user]);

  const setTokenAndUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, token, loading, setTokenAndUser, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}
