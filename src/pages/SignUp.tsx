import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setLoading(false);
      alert('Account created! (Demo mode)');
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
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-slate-400 text-center mb-8">Join Osirix and start creating content with AI</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-white font-semibold mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-slate-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Login
          </Link>
        </p>

        <p className="text-slate-400 text-center mt-4 text-xs">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-slate-400 hover:text-slate-300">
            Terms & Conditions
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
