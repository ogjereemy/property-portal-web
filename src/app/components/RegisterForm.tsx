import { useState } from 'react';

interface RegisterFormProps {
  handleAuth: (isLogin: boolean, email: string, password: string, role?: string) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export default function RegisterForm({ handleAuth, setIsLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = () => {
    handleAuth(false, email, password, role);
    setEmail('');
    setPassword('');
    setRole('customer');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Register</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition transform hover:scale-105"
        >
          Register
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => setIsLogin(true)}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}