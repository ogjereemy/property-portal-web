import { useState } from 'react';

interface LoginFormProps {
  handleAuth: (isLogin: boolean, email: string, password: string, role?: string) => Promise<void>;
  setIsLogin: (isLogin: boolean) => void;
}

export default function LoginForm({ handleAuth, setIsLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submit:', { email, password });
    await handleAuth(true, email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            required
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
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition transform hover:scale-105"
        >
          Sign In
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => setIsLogin(false)}
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </button>
      </p>
    </div>
  );
}