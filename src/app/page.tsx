'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { User, Listing, LoginResponse } from '../app/types';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    title: '',
    price: 0,
    location: '',
    description: '',
  });
  const [filters, setFilters] = useState<{ price_max?: string; location?: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchListings = useCallback(async (authToken: string) => {
    try {
      const params: { price_max?: string; location?: string } = {};
      if (filters.price_max) params.price_max = filters.price_max;
      if (filters.location) params.location = filters.location;
      const { data } = await axios.get<Listing[]>(`${API_URL}/api/listings`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  }, [filters]);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const { data } = await axios.get<LoginResponse>(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log('Fetched user:', data.user);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user', error);
      setToken('');
      localStorage.removeItem('token');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post<LoginResponse>(`${API_URL}/api/login`, { email, password });
      console.log('Login response:', data);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      console.log('Stored token:', localStorage.getItem('token'));
      fetchListings(data.token);
      setToast({ message: 'Login successful', type: 'success' });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newListing.title) errors.title = 'Title is required';
    if (!newListing.price || newListing.price <= 0) errors.price = 'Valid price is required';
    if (!newListing.location) errors.location = 'Location is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateListing = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${API_URL}/api/listings`, newListing, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewListing({ title: '', price: 0, location: '', description: '' });
      fetchListings(token);
      setToast({ message: 'Listing created successfully', type: 'success' });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setToast({ message: err.response?.data?.message || 'Failed to create listing', type: 'error' });
    }
  };

  const handleFilter = () => {
    if (token) fetchListings(token);
  };

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchListings(storedToken);
      fetchUser(storedToken);
    }
  }, [fetchListings, fetchUser]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Property Portal</h1>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Buy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Rent</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Agents</a>
            {token ? (
              <button
                onClick={() => {
                  setToken('');
                  setUser(null);
                  localStorage.removeItem('token');
                  setToast({ message: 'Logged out', type: 'success' });
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Logout
              </button>
            ) : (
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Sign In</a>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!token ? (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In</h2>
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Welcome, {user?.email} ({user?.role})
              </p>
              {user?.role === 'agent' && !user?.verified && (
                <p className="text-red-600 mt-2">Your agent account is not yet verified.</p>
              )}
              {user?.role === 'agent' && user?.verified && (
                <p className="text-green-600 mt-2">You are a verified agent. Create a listing below.</p>
              )}
            </div>

            {/* Create Listing Form */}
            {user?.role === 'agent' && user?.verified && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Listing</h2>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                    <input
                      type="text"
                      value={newListing.title}
                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      placeholder="e.g., Luxury Villa"
                      className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)</label>
                    <input
                      type="number"
                      value={newListing.price || ''}
                      onChange={(e) => setNewListing({ ...newListing, price: parseFloat(e.target.value) })}
                      placeholder="e.g., 1000000"
                      className={`w-full border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                      placeholder="e.g., Dubai Marina"
                      className={`w-full border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      placeholder="Describe the property..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Image</label>
                    <input
                      type="file"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                      title="Image upload coming soon"
                    />
                    <p className="text-gray-500 text-sm mt-1">Image upload will be enabled in a future update.</p>
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition"
                  >
                    Create Listing
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Search Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="number"
                  value={filters.price_max || ''}
                  onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                  placeholder="Max Price (AED)"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder="Location"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleFilter}
                  className="bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-gray-200" /> {/* Placeholder for image */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                    <p className="text-blue-600 font-bold">AED {listing.price.toLocaleString()}</p>
                    <p className="text-gray-600">{listing.location}</p>
                    <p className="text-gray-500 text-sm mt-2">{listing.description}</p>
                    <button className="mt-4 text-blue-600 font-medium hover:underline">
                      Contact Agent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold">Property Portal</h3>
              <p className="text-gray-400 text-sm mt-2">
                Find your dream home with the leading property platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Buy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Rent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Agents</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Mortgage Calculator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}