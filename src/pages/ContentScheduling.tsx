import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2, Edit2, Check, AlertCircle, Repeat2, Zap } from 'lucide-react';
import { useScheduling } from '../hooks/useScheduling';
import { useSocialMedia } from '../hooks/useSocialMedia';

const ContentScheduling = () => {
  const { scheduledPosts, upcomingPosts, stats, optimalTimes, schedulePost, deletePost, cancelPost, updatePost } = useScheduling();
  const { connections } = useSocialMedia();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    caption: '',
    platforms: [] as string[],
    scheduledTime: new Date(),
    timezone: 'UTC',
    recurrence: 'once' as 'once' | 'daily' | 'weekly' | 'monthly' | 'custom',
    maxRecurrences: 5,
  });

  const handleSchedule = () => {
    if (!formData.caption.trim() || formData.platforms.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    schedulePost(
      '', // content
      formData.caption,
      formData.platforms,
      formData.scheduledTime,
      formData.timezone,
      {
        recurrence: formData.recurrence,
        maxRecurrences: formData.recurrence === 'once' ? undefined : formData.maxRecurrences,
      }
    );

    setFormData({
      caption: '',
      platforms: [],
      scheduledTime: new Date(),
      timezone: 'UTC',
      recurrence: 'once',
      maxRecurrences: 5,
    });
    setShowScheduleModal(false);
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const getPostsForDay = (date: Date | null) => {
    if (!date) return [];
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const monthDays = getDaysArray();

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Content Scheduling</h1>
          <p className="text-slate-400">Schedule and automate your social media posts</p>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
          >
            {[
              { label: 'Scheduled', value: stats.totalScheduled, icon: Clock },
              { label: 'Published', value: stats.totalPublished, icon: Check },
              { label: 'Failed', value: stats.totalFailed, icon: AlertCircle },
              { label: 'Avg Engagement', value: stats.avgEngagement.toFixed(1) + '%', icon: Zap },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ translateY: -5 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Schedule Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScheduleModal(!showScheduleModal)}
          className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule New Post
        </motion.button>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-slate-800 rounded-xl p-8 border border-slate-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Schedule a Post</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Caption */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-white mb-2">Caption</label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Write your post caption..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none h-20"
                />
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime.toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledTime: new Date(e.target.value) })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {['UTC', 'America/New_York', 'America/Chicago', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Platforms */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-3">Platforms</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {connections.map((conn) => (
                    <label
                      key={conn.id}
                      className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-purple-500 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(conn.platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              platforms: [...formData.platforms, conn.platform],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              platforms: formData.platforms.filter((p) => p !== conn.platform),
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-white capitalize">{conn.platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recurrence */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">Recurrence</label>
                <select
                  value={formData.recurrence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                {formData.recurrence !== 'once' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-white mb-2">Max Recurrences</label>
                    <input
                      type="number"
                      value={formData.maxRecurrences}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxRecurrences: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="52"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSchedule}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold"
              >
                Schedule Post
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Calendar */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                  }
                  className="text-slate-400 hover:text-white"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                  }
                  className="text-slate-400 hover:text-white"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, idx) => {
                const dayPosts = day ? getPostsForDay(day) : [];
                const isToday =
                  day &&
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth();

                return (
                  <motion.button
                    key={idx}
                    whileHover={day ? { scale: 1.05 } : {}}
                    onClick={() => day && setSelectedDate(day)}
                    className={`p-3 rounded-lg text-sm h-20 flex flex-col items-center justify-center transition-colors ${
                      day
                        ? isToday
                          ? 'bg-purple-600 text-white'
                          : selectedDate?.getDate() === day.getDate()
                          ? 'bg-slate-700 border border-purple-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                        : ''
                    }`}
                  >
                    {day && (
                      <>
                        <span className="font-bold">{day.getDate()}</span>
                        {dayPosts.length > 0 && (
                          <span className="text-xs mt-1 bg-pink-500 px-2 py-1 rounded">
                            {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Posts & Optimal Times */}
          <div className="space-y-6">
            {/* Upcoming Posts */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Next 7 Days
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {upcomingPosts.length > 0 ? (
                  upcomingPosts.map((post) => (
                    <div key={post.id} className="bg-slate-700 rounded-lg p-3">
                      <p className="text-white text-sm truncate">{post.caption}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(post.scheduledTime).toLocaleDateString()} at{' '}
                        {new Date(post.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No scheduled posts</p>
                )}
              </div>
            </div>

            {/* Optimal Posting Times */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Best Times to Post
              </h3>
              <div className="space-y-2">
                {optimalTimes.map((time, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-white font-medium capitalize">{time.platform}</p>
                    <p className="text-slate-400 text-xs">
                      {time.day} at {time.time} ({time.engagement}% engagement)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scheduled Posts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">All Scheduled Posts</h2>
          <div className="space-y-3">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ translateX: 5 }}
                  className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{post.caption}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span>{new Date(post.scheduledTime).toLocaleString()}</span>
                      <span>{post.platforms.join(', ')}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        post.status === 'scheduled'
                          ? 'bg-blue-500/20 text-blue-300'
                          : post.status === 'published'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {post.status}
                      </span>
                      {post.recurrence && post.recurrence !== 'once' && (
                        <span className="flex items-center gap-1">
                          <Repeat2 className="w-4 h-4" />
                          {post.recurrence}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => cancelPost(post.id)}
                      disabled={post.status !== 'scheduled'}
                      className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No scheduled posts yet. Create one to get started!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentScheduling;
