import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Share2 } from 'lucide-react';
import { useSocialMedia } from '../hooks/useSocialMedia';

const SocialConnections = () => {
  const { connections, loading, error, analytics, initiateConnection, disconnectPlatform, syncAnalytics, postToMultiplePlatforms } = useSocialMedia();
  const [selectedForPost, setSelectedForPost] = useState<string[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postCaption, setPostCaption] = useState('');

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'from-blue-600 to-cyan-600',
      clientId: process.env.REACT_APP_TWITTER_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_TWITTER_CLIENT_SECRET || '',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'from-pink-600 to-orange-600',
      clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_INSTAGRAM_CLIENT_SECRET || '',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: 'from-purple-600 to-pink-600',
      clientId: process.env.REACT_APP_TIKTOK_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_TIKTOK_CLIENT_SECRET || '',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      color: 'from-red-600 to-pink-600',
      clientId: process.env.REACT_APP_YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_YOUTUBE_CLIENT_SECRET || '',
    },
  ];

  const isConnected = (platformId: string) =>
    connections.some((c) => c.platform === platformId);

  const handleConnect = (platform: typeof platforms[0]) => {
    const redirectUri = `${window.location.origin}/auth/callback?platform=${platform.id}`;
    initiateConnection(platform.id as any, platform.clientId, redirectUri);
  };

  const handleDisconnect = (connectionId: string) => {
    if (confirm('Are you sure you want to disconnect this platform?')) {
      disconnectPlatform(connectionId);
    }
  };

  const handlePostToSelected = async () => {
    if (!postCaption.trim() || selectedForPost.length === 0) return;

    const platformsToPost = selectedForPost.map((id) => id as any);
    await postToMultiplePlatforms(platformsToPost, {
      caption: postCaption,
      platform: platformsToPost[0],
    });

    setPostCaption('');
    setSelectedForPost([]);
    setShowPostModal(false);
  };

  const handleRefreshAnalytics = async (platform: string) => {
    await syncAnalytics(platform as any);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Social Media Connections</h1>
          <p className="text-slate-400">Connect and manage your social media accounts</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Connected Platforms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {platforms.map((platform) => {
            const connected = isConnected(platform.id);
            const connection = connections.find((c) => c.platform === platform.id);
            const platformAnalytics = analytics[platform.id as any];

            return (
              <motion.div
                key={platform.id}
                whileHover={{ translateY: -5 }}
                className={`rounded-xl p-6 border-2 transition-all ${
                  connected
                    ? `bg-gradient-to-br ${platform.color} border-opacity-50`
                    : 'bg-slate-800 border-slate-700 hover:border-purple-500'
                }`}
              >
                <div className="text-4xl mb-3">{platform.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${connected ? 'text-white' : 'text-white'}`}>
                  {platform.name}
                </h3>

                {connected && connection ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <CheckCircle className="w-4 h-4" />
                      <span>Connected</span>
                    </div>
                    <div className="text-sm">
                      <p className="text-white/80">@{connection.username}</p>
                      {platformAnalytics && (
                        <p className="text-white/60 text-xs mt-1">
                          {platformAnalytics.followers.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRefreshAnalytics(platform.id)}
                        className="flex-1 bg-white/20 hover:bg-white/30 text-white py-1 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Sync
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDisconnect(connection.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 py-1 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Disconnect
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(platform)}
                    disabled={loading}
                    className="w-full bg-white/20 hover:bg-white/30 disabled:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mt-3"
                  >
                    <Plus className="w-4 h-4" />
                    Connect
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Post to Multiple Platforms */}
        {connections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Share2 className="w-6 h-6" />
                  Multi-Platform Posting
                </h2>
                <p className="text-slate-300">Post to multiple platforms at once</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPostModal(!showPostModal)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                {showPostModal ? 'Cancel' : 'Create Post'}
              </motion.button>
            </div>

            {showPostModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Post Caption</label>
                  <textarea
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    placeholder="Write your post here..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Post to Platforms</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {connections.map((conn) => (
                      <label
                        key={conn.id}
                        className="flex items-center p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedForPost.includes(conn.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedForPost((prev) => [...prev, conn.id]);
                            } else {
                              setSelectedForPost((prev) => prev.filter((id) => id !== conn.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-sm text-white">{conn.platform.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePostToSelected}
                  disabled={loading || !postCaption.trim() || selectedForPost.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Posting...' : 'Post to Selected Platforms'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Analytics Overview */}
        {connections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {connections.map((conn) => {
                const platformAnalytics = analytics[conn.platform];
                return (
                  <motion.div
                    key={conn.id}
                    whileHover={{ translateY: -5 }}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">{conn.platform}</h3>
                      <RefreshCw className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-300" />
                    </div>

                    {platformAnalytics ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-slate-400 text-xs">Followers</p>
                          <p className="text-2xl font-bold text-white">
                            {(platformAnalytics.followers / 1000).toFixed(1)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Engagement Rate</p>
                          <p className="text-xl font-bold text-green-400">{platformAnalytics.engagementRate.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Total Reach</p>
                          <p className="text-lg font-bold text-white">
                            {(platformAnalytics.totalReach / 1000).toFixed(1)}K
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">Click sync to load analytics</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* No Connections State */}
        {connections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center bg-slate-800 rounded-xl p-12 border border-slate-700"
          >
            <ExternalLink className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Connected Platforms</h2>
            <p className="text-slate-400 mb-6">Connect your social media accounts to start posting and syncing analytics</p>
            <p className="text-slate-500 text-sm">Click on any platform above to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;
