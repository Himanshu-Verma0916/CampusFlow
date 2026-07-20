import { createContext, useContext, useState, useEffect } from "react";
import {loginUser,registerUser,getProfile,logoutUser} from "../services/AuthService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication when app loads
  const checkAuth = async () => {
    try {
      const data = await getProfile();

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // User is not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register User
  const register = async (name, email, password, role) => {
    try {
      const data = await registerUser(name, email, password, role);

      if (data.success) {
        await checkAuth();
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data.success) {
        await checkAuth();
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout User
  const logout = async () => {
    try {
      const data = await logoutUser();

      if (data.success) {
        setUser(null);
        
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Refresh Profile
  const refreshProfile = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    // State
    user,
    loading,
    isAuthenticated: !!user,

    // Actions
    register,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;