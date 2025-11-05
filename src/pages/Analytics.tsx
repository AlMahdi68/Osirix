import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    { label: 'Total Impressions', value: '487.2K', change: '+32%', icon: Eye, positive: true },
    { label: 'Engagement Rate', value: '6.8%', change: '+1.2%', icon: Heart, positive: true },
    { label: 'Click-through Rate', value: '3.4%', change: '-0.5%', icon: TrendingDown, positive: false },
    { label: 'Follower Growth', value: '+1,234', change: '+24% MoM', icon: Users, positive: true },
  ];

  const platformStats = [
    { platform: 'TikTok', followers: '45.2K', avgViews: '12.4K', engagement: '8.2%', revenue: '$324' },
    { platform: 'Instagram', followers: '32.1K', avgViews: '8.9K', engagement: '5.6%', revenue: '$218' },
    { platform: 'YouTube', followers: '18.5K', avgViews: '5.2K', engagement: '4.1%', revenue: '$542' },
    { platform: 'Twitter/X', followers: '12.3K', avgViews: '3.1K', engagement: '2.8%', revenue: '$87' },
  ];

  const topPosts = [
    {
      id: 1,
      title: 'How to Use AI for Content Creation',
      views: '125.4K',
      likes: '8,234',
      comments: '456',
      shares: '2,123',
      platform: 'TikTok',
    },
    {
      id: 2,
      title: 'Social Media Growth Hacks 2024',
      views: '98.7K',
      likes: '6,123',
      comments: '342',
      shares: '1,876',
      platform: 'Instagram',
    },
    {
      id: 3,
      title: 'Building Your Personal Brand',
      views: '76.2K',
      likes: '4,567',
      comments: '234',
      shares: '1,234',
      platform: 'YouTube',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Track your social media performance and growth</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ translateY: -5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-purple-400" />
                  <span
                    className={`text-sm font-semibold ${
                      metric.positive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h2 className="text-xl font-bold text-white mb-6">Platform Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-semibold">Platform</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-semibold">Followers</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-semibold">Avg Views</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-semibold">Engagement</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {platformStats.map((stat, idx) => (
                  <motion.tr
                    key={idx}
                    whileHover={{ backgroundColor: 'rgba(100, 116, 139, 0.3)' }}
                    className="border-b border-slate-700 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium">{stat.platform}</td>
                    <td className="text-right py-4 px-4 text-slate-300">{stat.followers}</td>
                    <td className="text-right py-4 px-4 text-slate-300">{stat.avgViews}</td>
                    <td className="text-right py-4 px-4">
                      <span className="text-green-400 font-semibold">{stat.engagement}</span>
                    </td>
                    <td className="text-right py-4 px-4 text-slate-300">{stat.revenue}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Performing Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Top Performing Posts</h2>
          <div className="space-y-4">
            {topPosts.map((post, idx) => (
              <motion.div
                key={idx}
                whileHover={{ translateX: 5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-purple-600 rounded text-white">
                        {post.platform}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Eye className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-slate-400 text-xs">Views</p>
                      <p className="text-white font-bold">{post.views}</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <p className="text-slate-400 text-xs">Likes</p>
                      <p className="text-white font-bold">{post.likes}</p>
                    </div>
                    <div className="text-center">
                      <MessageCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-slate-400 text-xs">Comments</p>
                      <p className="text-white font-bold">{post.comments}</p>
                    </div>
                    <div className="text-center">
                      <Share2 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <p className="text-slate-400 text-xs">Shares</p>
                      <p className="text-white font-bold">{post.shares}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
