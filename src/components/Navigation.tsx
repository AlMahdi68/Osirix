import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-700 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-bold text-white hidden sm:inline">Osirix</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
