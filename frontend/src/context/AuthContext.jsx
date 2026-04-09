/**
 * @file AuthContext.jsx
 * @description Context provider for User Authentication.
 * 
 * WHY THIS FILE EXISTS:
 * To manage user login sessions and provide user data globally.
 * 
 * WHAT HAPPENS IF REMOVED:
 * Future login implementations will lack a centralized context.
 */

/*
// ==========================================
// FUTURE FEATURE (LOGIN SYSTEM - COMMENTED)
// ==========================================
// This is disabled until profile feature is added. 
// Remove these comments to enable the Auth component and Provider.

import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

*/
