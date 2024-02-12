import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Moved inside AuthProvider to access context state and methods
  const refreshToken = async () => {
    console.log("inside refresh token")
    try {
      console.log("inside refresh tooken try block")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/token`, {
        method: 'POST',
        credentials: 'include', // Necessary to include cookies
      });
      if (!response.ok) throw new Error('Failed to refresh token');
      const data = await response.json();
      console.log("inside the successufl token refresh", data)
      return data.accessToken; // Assuming the response includes the new access token
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null; // Indicate failure
    }
  };

  // Add a method to perform API calls with automatic token refresh and retry
  const fetchWithAuth = async (url, options) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    if (response.status === 401) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        // Retry the fetch with the new access token
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        logout();
      }
    }

    return response;
  };

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
    fetchWithAuth,
    checkAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

