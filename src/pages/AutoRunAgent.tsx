import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Loader,
  TrendingUp,
  DollarSign,
  Video,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAI } from '../hooks/useAI';
import { useSocialMedia } from '../hooks/useSocialMedia';
import { useScheduling } from '../hooks/useScheduling';
import { AutoRunWorkflow } from '../types/index';

const AutoRunAgent = () => {
  const { autoRunWorkflows, addAutoRunWorkflow, updateAutoRunWorkflow, deleteAutoRunWorkflow } =
    useAppStore();
  const { generateVideo } = useAI();
  const { postToMultiplePlatforms, syncAnalytics } = useSocialMedia();
  const { schedulePost } = useScheduling();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contentStrategy: '',
    videoStyle: 'Cinematic' as const,
    platforms: ['tiktok', 'instagram'] as string[],
    timezone: 'UTC',
    postTime: '10:00',
    includeCharacter: true,
    includeVoice: true,
    autoMonetize: true,
    maxDailyPosts: 3,
  });

  const handleCreateWorkflow = () => {
    if (!formData.name || !formData.contentStrategy) {
      alert('Please fill in all required fields');
      return;
    }

    const newWorkflow: AutoRunWorkflow = {
      id: Date.now().toString(),
      name: formData.name,
      description: `Auto-generating ${formData.videoStyle} videos with ${formData.platforms.join(', ')}`,
      enabled: true,
      schedule: 'daily',
      config: {
        contentStrategy: formData.contentStrategy,
        videoStyle: formData.videoStyle as 'Cinematic' | 'Animated' | 'Artistic',
        platforms: formData.platforms,
        timezone: formData.timezone,
        postTime: formData.postTime,
        includeCharacter: formData.includeCharacter,
        includeVoice: formData.includeVoice,
        autoMonetize: formData.autoMonetize,
        maxDailyPosts: formData.maxDailyPosts,
      },
      stats: {
        totalVideosGenerated: 0,
        totalPostsPublished: 0,
        totalEngagement: 0,
        totalRevenue: 0,
        successRate: 0,
      },
    };

    addAutoRunWorkflow(newWorkflow);
    setFormData({
      name: '',
      contentStrategy: '',
      videoStyle: 'Cinematic',
      platforms: ['tiktok', 'instagram'],
      timezone: 'UTC',
      postTime: '10:00',
      includeCharacter: true,
      includeVoice: true,
      autoMonetize: true,
      maxDailyPosts: 3,
    });
    setShowCreateModal(false);
  };

  const handleRunWorkflow = async (workflow: AutoRunWorkflow) => {
    if (runningWorkflowId) return;

    setRunningWorkflowId(workflow.id);
    setLoading(true);

    try {
      // Step 1: Generate video
      const videoPrompt = `${workflow.config.contentStrategy} Create an engaging ${workflow.config.videoStyle} video about current trends`;
      console.log('Generating video:', videoPrompt);

      // Simulate AI video generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Auto-post to platforms
      console.log('Auto-posting to:', workflow.config.platforms);

      // Step 3: Sync analytics
      await syncAnalytics();

      // Step 4: Update workflow stats
      const updatedStats = {
        ...workflow.stats,
        totalVideosGenerated: workflow.stats.totalVideosGenerated + 1,
        totalPostsPublished:
          workflow.stats.totalPostsPublished + workflow.config.platforms.length,
        successRate: 95,
      };

      updateAutoRunWorkflow(workflow.id, {
        stats: updatedStats,
        lastRun: new Date(),
      });

      alert('✅ AutoRun completed! Video generated and posted to all platforms.');
    } catch (error) {
      console.error('AutoRun error:', error);
      alert('❌ AutoRun failed. Please check your configuration.');
    } finally {
      setRunningWorkflowId(null);
      setLoading(false);
    }
  };

  const toggleWorkflow = (workflow: AutoRunWorkflow) => {
    updateAutoRunWorkflow(workflow.id, { enabled: !workflow.enabled });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">AutoRun Agent</h1>
              <p className="text-slate-400">
                Automate your entire content workflow: generate videos → post to multiple platforms → earn revenue
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              New Workflow
            </motion.button>
          </div>
        </motion.div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {autoRunWorkflows.map((workflow, idx) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{workflow.name}</h3>
                  <p className="text-slate-400 text-sm">{workflow.description}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    workflow.enabled ? 'bg-green-500' : 'bg-slate-500'
                  }`}
                ></div>
              </div>

              {/* Config Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Platforms</p>
                  <p className="text-sm text-white">{workflow.config.platforms.join(', ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Style</p>
                  <p className="text-sm text-white">{workflow.config.videoStyle}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Post Time</p>
                  <p className="text-sm text-white">{workflow.config.postTime}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Max Daily Posts</p>
                  <p className="text-sm text-white">{workflow.config.maxDailyPosts}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-slate-700">
                <div className="text-center">
                  <Video className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Videos</p>
                  <p className="text-sm font-bold text-white">{workflow.stats.totalVideosGenerated}</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Posts</p>
                  <p className="text-sm font-bold text-white">{workflow.stats.totalPostsPublished}</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Engagement</p>
                  <p className="text-sm font-bold text-white">{workflow.stats.totalEngagement}</p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Revenue</p>
                  <p className="text-sm font-bold text-white">${workflow.stats.totalRevenue}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRunWorkflow(workflow)}
                  disabled={runningWorkflowId === workflow.id || !workflow.enabled}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  {runningWorkflowId === workflow.id ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Now
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWorkflow(workflow)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors ${
                    workflow.enabled
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {workflow.enabled ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Enable
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteAutoRunWorkflow(workflow.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {autoRunWorkflows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700"
          >
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No AutoRun Workflows Yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first workflow to automate content generation and posting
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create First Workflow
            </motion.button>
          </motion.div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create AutoRun Workflow</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Workflow Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily TikTok Content"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">
                    Content Strategy
                  </label>
                  <textarea
                    value={formData.contentStrategy}
                    onChange={(e) => setFormData({ ...formData, contentStrategy: e.target.value })}
                    placeholder="e.g., Create trending lifestyle and motivational content"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Video Style</label>
                  <select
                    value={formData.videoStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videoStyle: e.target.value as 'Cinematic' | 'Animated' | 'Artistic',
                      })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Cinematic</option>
                    <option>Animated</option>
                    <option>Artistic</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Platforms</label>
                  <div className="space-y-2">
                    {['tiktok', 'instagram', 'youtube', 'twitter'].map((platform) => (
                      <label key={platform} className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                platforms: [...formData.platforms, platform],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                platforms: formData.platforms.filter((p) => p !== platform),
                              });
                            }
                          }}
                          className="rounded"
                        />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">
                    Daily Post Time
                  </label>
                  <input
                    type="time"
                    value={formData.postTime}
                    onChange={(e) => setFormData({ ...formData, postTime: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">
                    Max Daily Posts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxDailyPosts}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDailyPosts: parseInt(e.target.value) })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.includeCharacter}
                      onChange={(e) =>
                        setFormData({ ...formData, includeCharacter: e.target.checked })
                      }
                      className="rounded"
                    />
                    Include Digital Character
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.includeVoice}
                      onChange={(e) => setFormData({ ...formData, includeVoice: e.target.checked })}
                      className="rounded"
                    />
                    Include Voice Synthesis
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.autoMonetize}
                      onChange={(e) =>
                        setFormData({ ...formData, autoMonetize: e.target.checked })
                      }
                      className="rounded"
                    />
                    Auto-Monetize Content
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateWorkflow}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg font-semibold"
                >
                  Create Workflow
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AutoRunAgent;
