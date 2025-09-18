import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          email: response.data.email,
          role: response.data.role,
          token
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    await checkAuth();
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/events');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};