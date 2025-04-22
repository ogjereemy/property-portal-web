import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { User, LoginResponse } from '../types';

export const useAuth = () => {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      console.log('Fetching user with token:', authToken);
      const { data } = await axios.get<LoginResponse>(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('Fetched user:', data.user);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      setToast({ message: 'Session expired. Please log in again.', type: 'error' });
    }
  }, []);

  const handleAuth = async (isLogin: boolean, email: string, password: string, role?: string) => {
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin ? { email, password } : { email, password, role };
      console.log(`Sending ${isLogin ? 'login' : 'register'} request:`, payload);
      const { data } = await axios.post<LoginResponse>(`${API_URL}${endpoint}`, payload);
      console.log(`${isLogin ? 'Login' : 'Register'} response:`, data);

      if (isLogin) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        console.log('Stored token:', localStorage.getItem('token'));
        setToast({ message: 'Login successful', type: 'success' });
      } else {
        setToast({ message: 'Registration successful. Please log in.', type: 'success' });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(`${isLogin ? 'Login' : 'Register'} error:`, err.response?.data);
      setToast({ message: err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'), type: 'error' });
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setToast({ message: 'Logged out', type: 'success' });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log('Stored token:', storedToken);
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, [fetchUser]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return { token, user, toast, handleAuth, handleLogout, fetchUser };
};