import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Loader, Download, Volume2, Play, Zap, Eye } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { useAppStore } from '../store/appStore';
import { generateMockVideoUrl, sampleVideoPrompts, generateId } from '../utils/helpers';
import { PRICING_PLANS } from '../utils/pricingPlans';

interface GeneratedContent {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  status: 'completed' | 'generating';
}

const ContentCreation = () => {
  const { generateVideo, loading, error } = useAI();
  const { subscription, monthlyUsage, incrementVideoUsage, addGeneratedVideo } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [style, setStyle] = useState<'Cinematic' | 'Animated' | 'Artistic'>('Cinematic');
  const [duration, setDuration] = useState(15);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');

  const currentPlan = PRICING_PLANS.find(p => p.id === subscription?.planId) || PRICING_PLANS[0];
  const canGenerateMore = monthlyUsage.videosGenerated < currentPlan.limits.monthlyVideos;

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || !canGenerateMore) return;

    setGenerationError(null);
    try {
      // Call AI SDK to generate video
      const videoUrl = await generateVideo(prompt, {
        style,
        duration,
      });

      const content: GeneratedContent = {
        id: generateId(),
        prompt,
        videoUrl: videoUrl || generateMockVideoUrl(),
        thumbnail: `https://via.placeholder.com/400x300?text=${encodeURIComponent(style)}`,
        duration,
        status: 'completed',
      };

      setGeneratedContent([content, ...generatedContent]);
      incrementVideoUsage();
      setPrompt('');

      addGeneratedVideo({
        id: content.id,
        prompt,
        style,
        duration,
        videoUrl: content.videoUrl,
        thumbnail: content.thumbnail,
        status: 'completed',
        createdAt: new Date(),
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate video';
      setGenerationError(errorMsg);
      console.error('Video generation error:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Content Creation</h1>
          <p className="text-slate-400">Generate AI-powered videos in seconds</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creation Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Generate Video</h2>

              <div className="space-y-4">
                {/* Usage Stats */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-slate-300 font-semibold">Monthly Videos</p>
                    <p className="text-white font-bold">
                      {monthlyUsage.videosGenerated}/{currentPlan.limits.monthlyVideos}
                    </p>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{
                        width: `${(monthlyUsage.videosGenerated / currentPlan.limits.monthlyVideos) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Video Prompt */}
                <div>
                  <label className="block text-white font-semibold mb-2">Video Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your video idea..."
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                    disabled={loading || !canGenerateMore}
                  />
                </div>

                {/* Video Style */}
                <div>
                  <label className="block text-white font-semibold mb-2">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    disabled={loading || !canGenerateMore}
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Animated">Animated</option>
                    <option value="Artistic">Artistic</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-white font-semibold mb-2">Duration (seconds)</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full"
                    disabled={loading || !canGenerateMore}
                  />
                  <p className="text-slate-400 text-sm mt-2">{duration} seconds</p>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-white font-semibold mb-2">Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>

                {/* Error Message */}
                {(generationError || error) && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{generationError || error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateVideo}
                  disabled={loading || !prompt.trim() || !canGenerateMore}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Generate Video
                    </>
                  )}
                </motion.button>

                {!canGenerateMore && (
                  <p className="text-orange-400 text-sm text-center">
                    You've reached your monthly video limit. Upgrade your plan to generate more.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Generated Videos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Generated Videos</h2>

              {generatedContent.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No videos generated yet. Create your first video above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedContent.map((content) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-purple-500 transition"
                    >
                      <div className="relative aspect-video bg-slate-900 flex items-center justify-center cursor-pointer group">
                        <img
                          src={content.thumbnail}
                          alt={content.prompt}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setShowPreview(content.videoUrl)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition"
                        >
                          <Play className="w-12 h-12 text-white" />
                        </button>
                      </div>

                      <div className="p-4">
                        <p className="text-white text-sm font-semibold mb-2 line-clamp-2">{content.prompt}</p>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {formatDuration(content.duration)}
                          </p>
                          <p className="text-slate-400 text-xs">{content.status}</p>
                        </div>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={content.videoUrl}
                          download
                          className="w-full bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPreview(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-2xl w-full rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={showPreview}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ContentCreation;
