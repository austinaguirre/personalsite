// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('token'); // Or decode the token to get user details
    if (user) {
      setCurrentUser(user); // Here you might want to set more detailed user info
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setCurrentUser(token); // Again, set user details as needed
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


