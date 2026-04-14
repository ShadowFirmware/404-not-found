import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import useInactivityTimer from '../hooks/useInactivityTimer';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Escuchar cambios en localStorage (login social desde misma tab)
    const handleStorage = () => setUser(authService.getCurrentUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const handleInactivityWarn = useCallback(() => {
    toast('Tu sesión cerrará en 1 minuto por inactividad.', {
      icon: '⏱️',
      duration: 10000,
      id: 'inactivity-warn',
    });
  }, []);

  const handleInactivityLogout = useCallback(() => {
    toast.dismiss('inactivity-warn');
    toast.error('Sesión cerrada por inactividad.');
    logout();
  }, [logout]);

  useInactivityTimer(handleInactivityLogout, handleInactivityWarn, !!user);

  const setUserFromStorage = () => {
    setUser(authService.getCurrentUser());
  };

  const value = {
    user,
    login,
    register,
    logout,
    setUserFromStorage,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
