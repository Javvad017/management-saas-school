import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== Frontend Login Attempt ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

    const result = await login(email, password);
    
    console.log('Login result:', result);
    
    if (!result.success) {
      console.error('Login failed:', result.error);
      setError(result.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    } else {
      console.log('Login successful!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold text-gray-800">
            School Management
          </h2>
          <p className="text-gray-600 mt-2">MongoDB Edition</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="admin@school.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 font-medium mb-2">Default Credentials:</p>
          <p className="text-sm text-gray-600">Email: admin@school.com</p>
          <p className="text-sm text-gray-600">Password: admin123</p>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700">
            🗄️ Using MongoDB local database
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
