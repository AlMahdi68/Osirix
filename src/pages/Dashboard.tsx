import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Video, Users, Zap, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const Dashboard = () => {
  const { subscription, monthlyUsage } = useAppStore();
  const isAuthenticated = !!subscription;

  const metrics = [
    { label: 'Total Posts', value: '0', change: '+12%', icon: Video },
    { label: 'Total Views', value: '125.4K', change: '+28%', icon: TrendingUp },
    { label: 'Followers', value: '45.2K', change: '+8%', icon: Users },
    { label: 'Engagement Rate', value: '6.8%', change: '+3%', icon: Zap },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome to Osirix</h1>
            <p className="text-xl text-slate-400 mb-8">
              Your all-in-one AI platform for creating, scheduling, and monetizing social media content
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 border border-slate-700 transition"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-2">🎬 AI Video Generation</h3>
              <p className="text-slate-400 text-sm">Generate stunning videos with AI in seconds</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-2">📱 Multi-Platform Posting</h3>
              <p className="text-slate-400 text-sm">Post to TikTok, Instagram, YouTube, and more</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-2">💰 Monetization</h3>
              <p className="text-slate-400 text-sm">Sell digital products and maximize revenue</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-slate-400">Manage your social media presence with AI</p>
        </motion.div>

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{subscription?.plan || 'Free'} Plan</h2>
              <p className="text-slate-400">${subscription?.price || 0}/month</p>
            </div>
            {subscription?.plan !== 'Enterprise' && (
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{metric.change}</span>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{metric.label}</h3>
                <p className="text-white text-2xl font-bold">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8"
          >
            <h3 className="text-white text-2xl font-bold mb-2">Create New Post</h3>
            <p className="text-white/80 mb-6">Generate video content from text</p>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold inline-block"
              >
                Get Started →
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8"
          >
            <h3 className="text-white text-2xl font-bold mb-2">View Analytics</h3>
            <p className="text-white/80 mb-6">Track your performance metrics</p>
            <Link to="/analytics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold inline-block"
              >
                View Dashboard →
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-white text-lg font-bold mb-6">Monthly Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-2">Videos</p>
              <p className="text-white text-2xl font-bold">{monthlyUsage.videosGenerated}/5</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Characters</p>
              <p className="text-white text-2xl font-bold">{monthlyUsage.charactersCreated}/5</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Voices</p>
              <p className="text-white text-2xl font-bold">{monthlyUsage.voicesGenerated}/5</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Posts</p>
              <p className="text-white text-2xl font-bold">{monthlyUsage.postsScheduled}/10</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
