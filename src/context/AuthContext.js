import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initially check if the user is authenticated
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/checkAuth`, {
        credentials: 'include', // Ensure cookies are included with the request
      });
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated){
          setCurrentUser(data); // Adjust according to your API response
        }
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Authentication check failed authContext.js:', error);
      setCurrentUser(null);
    }
  };

  const login = async () => {
    await checkAuthentication();
  };  

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include', // Ensure cookies are included with the request
    });
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    checkAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
