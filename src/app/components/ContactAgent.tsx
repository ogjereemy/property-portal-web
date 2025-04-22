import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { User } from '../types';

interface ContactAgentProps {
  listingId: number;
  user: User | null;
  token: string;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const ContactAgent: React.FC<ContactAgentProps> = ({ listingId, user, token, setToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContact = async (type: 'call' | 'whatsapp' | 'email') => {
    if (!user || !token) {
      setToast({ message: 'Authentication required', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'email') {
        await axios.post(
          `${API_URL}/api/communications/email`,
          { listingId, name, email: email || user.email, message },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setToast({ message: 'Email logged', type: 'success' });
      } else {
        const response = await axios.post(
          `${API_URL}/api/communications`,
          { type, listingId, userEmail: email || user.email },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const { virtualNumber } = response.data;

        if (type === 'call') {
          window.location.href = `tel:${virtualNumber}`;
          setToast({ message: 'Call initiated', type: 'success' });
        } else if (type === 'whatsapp') {
          try {
            window.location.href = `whatsapp://send/?phone=${virtualNumber}&text=&type=phone_number&app_absent=0`;
            setToast({ message: 'WhatsApp chat opened', type: 'success' });
          } catch (err) {
            console.warn('WhatsApp deep link error:', err);
            setToast({ message: 'WhatsApp chat opened', type: 'success' });
          }
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Contact error:', error.response?.data || error.message);
      setToast({ message: error.response?.data?.message || 'Failed to initiate contact', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full border border-gray-300 rounded-lg p-2"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className="w-full border border-gray-300 rounded-lg p-2"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        className="w-full border border-gray-300 rounded-lg p-2"
        rows={4}
      />
      <div className="flex space-x-4">
        <button
          onClick={() => handleContact('call')}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Call Agent
        </button>
        <button
          onClick={() => handleContact('whatsapp')}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          WhatsApp Agent
        </button>
        <button
          onClick={() => handleContact('email')}
          disabled={isLoading}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
        >
          Email Agent
        </button>
      </div>
    </div>
  );
};

export default ContactAgent;