import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      alert('Login successful! (Demo mode)');
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-800 rounded-xl border border-slate-700 p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">Login to Osirix</h1>
        <p className="text-slate-400 text-center mb-8">Welcome back! Log in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-slate-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
            Sign up
          </Link>
        </p>

        <p className="text-slate-400 text-center mt-4 text-sm">
          <Link to="/terms" className="text-slate-400 hover:text-slate-300">
            Terms & Conditions
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
