import { useState, useCallback, useEffect } from 'react';
import { schedulingService, ScheduledPost, OptimalPostingTime, SchedulingStats } from '../api/schedulingService';

export const useScheduling = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SchedulingStats | null>(null);
  const [optimalTimes, setOptimalTimes] = useState<OptimalPostingTime[]>([]);

  // Load posts on mount
  useEffect(() => {
    refreshScheduledPosts();
    setOptimalTimes(schedulingService.getOptimalPostingTimes());
    setStats(schedulingService.getSchedulingStats());

    // Initialize background scheduling
    schedulingService.initializeBackgroundScheduling();

    // Listen for scheduled posts ready event
    const handleScheduledReady = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.posts) {
        console.log('Scheduled posts ready for posting:', customEvent.detail.posts);
        refreshScheduledPosts();
      }
    };

    window.addEventListener('scheduled-posts-ready', handleScheduledReady);
    return () => {
      window.removeEventListener('scheduled-posts-ready', handleScheduledReady);
    };
  }, []);

  const refreshScheduledPosts = useCallback(() => {
    try {
      const posts = schedulingService.getScheduledPosts();
      setScheduledPosts(posts);
      setUpcomingPosts(schedulingService.getUpcomingPosts(7));
      setStats(schedulingService.getSchedulingStats());
    } catch (err) {
      setError('Failed to load scheduled posts');
      console.error(err);
    }
  }, []);

  const schedulePost = useCallback(
    (
      content: string,
      caption: string,
      platforms: string[],
      scheduledTime: Date,
      timezone: string,
      options?: {
        mediaUrl?: string;
        recurrence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
        recurrenceInterval?: number;
        maxRecurrences?: number;
        tags?: string[];
      }
    ) => {
      try {
        setError(null);
        const post = schedulingService.createScheduledPost(
          content,
          caption,
          platforms,
          scheduledTime,
          timezone,
          options
        );
        schedulingService.saveScheduledPost(post);
        refreshScheduledPosts();
        return post;
      } catch (err) {
        const errorMsg = 'Failed to schedule post';
        setError(errorMsg);
        console.error(err);
        throw err;
      }
    },
    [refreshScheduledPosts]
  );

  const updatePost = useCallback(
    (postId: string, updates: Partial<ScheduledPost>) => {
      try {
        setError(null);
        schedulingService.updateScheduledPost(postId, updates);
        refreshScheduledPosts();
      } catch (err) {
        setError('Failed to update post');
        console.error(err);
        throw err;
      }
    },
    [refreshScheduledPosts]
  );

  const deletePost = useCallback(
    (postId: string) => {
      try {
        setError(null);
        schedulingService.deleteScheduledPost(postId);
        refreshScheduledPosts();
      } catch (err) {
        setError('Failed to delete post');
        console.error(err);
        throw err;
      }
    },
    [refreshScheduledPosts]
  );

  const cancelPost = useCallback(
    (postId: string) => {
      try {
        setError(null);
        schedulingService.cancelScheduledPost(postId);
        refreshScheduledPosts();
      } catch (err) {
        setError('Failed to cancel post');
        console.error(err);
        throw err;
      }
    },
    [refreshScheduledPosts]
  );

  const processQueue = useCallback(
    async (postingFunction: (post: ScheduledPost) => Promise<void>) => {
      setLoading(true);
      try {
        setError(null);
        await schedulingService.processQueue(postingFunction);
        refreshScheduledPosts();
      } catch (err) {
        setError('Failed to process queue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [refreshScheduledPosts]
  );

  const getPostsForDate = useCallback((date: Date): ScheduledPost[] => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate() &&
        post.status === 'scheduled'
      );
    });
  }, [scheduledPosts]);

  const getPostStats = useCallback(() => {
    return schedulingService.getSchedulingStats();
  }, []);

  return {
    scheduledPosts,
    upcomingPosts,
    loading,
    error,
    stats,
    optimalTimes,
    schedulePost,
    updatePost,
    deletePost,
    cancelPost,
    processQueue,
    refreshScheduledPosts,
    getPostsForDate,
    getPostStats,
  };
};
