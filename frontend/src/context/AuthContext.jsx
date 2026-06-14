import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hl_user');
    const token = localStorage.getItem('hl_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('hl_token', token);
    localStorage.setItem('hl_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('hl_token', token);
    localStorage.setItem('hl_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const loginWithPhone = async (phone, otp) => {
    const res = await api.post('/auth/phone/login', { phone, otp });
    const { token, user } = res.data;
    localStorage.setItem('hl_token', token);
    localStorage.setItem('hl_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signupWithPhone = async (name, phone, otp) => {
    const res = await api.post('/auth/phone/signup', { name, phone, otp });
    const { token, user } = res.data;
    localStorage.setItem('hl_token', token);
    localStorage.setItem('hl_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const loginWithGoogle = async () => {
    // We mock the google profile here since we don't have a real OAuth popup
    const profileData = { name: 'Google User', email: `google_${Date.now()}@gmail.com`, google_id: `g_${Date.now()}` };
    const res = await api.post('/auth/google', profileData);
    const { token, user } = res.data;
    localStorage.setItem('hl_token', token);
    localStorage.setItem('hl_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('hl_token');
    localStorage.removeItem('hl_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithPhone, signupWithPhone, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
