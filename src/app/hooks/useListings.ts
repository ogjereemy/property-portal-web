import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Listing } from '../types';

export const useListings = (token: string, setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<{ price_max?: string; location?: string }>({});
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    title: '', price: 0, location: '', description: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchListings = useCallback(async () => {
    try {
      console.log('Fetching listings with filters:', filters);
      const params: { price_max?: string; location?: string } = {};
      if (filters.price_max) params.price_max = filters.price_max;
      if (filters.location) params.location = filters.location;
      const { data } = await axios.get<Listing[]>(`${API_URL}/api/listings`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log('Listings fetched:', data);
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setToast({ message: 'Failed to fetch listings', type: 'error' });
    }
  }, [filters, token, setToast]);

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
      console.log('Creating listing:', newListing);
      await axios.post(`${API_URL}/api/listings`, newListing, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewListing({ title: '', price: 0, location: '', description: '' });
      await fetchListings();
      setToast({ message: 'Listing created successfully', type: 'success' });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error('Create listing error:', err.response?.data);
      setToast({ message: err.response?.data?.message || 'Failed to create listing', type: 'error' });
    }
  };

  return { listings, filters, setFilters, newListing, setNewListing, formErrors, fetchListings, handleCreateListing };
};