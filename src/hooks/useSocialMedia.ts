import { useState, useCallback } from 'react';
import { socialMediaService, Platform, SocialMediaConnection, PostContent, SocialMediaPost, PlatformAnalytics } from '../api/socialMediaAPI';

export const useSocialMedia = () => {
  const [connections, setConnections] = useState<SocialMediaConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<Platform, PlatformAnalytics | null>>({
    twitter: null,
    instagram: null,
    tiktok: null,
    youtube: null,
  });

  const initiateConnection = useCallback(
    (platform: Platform, clientId: string, redirectUri: string) => {
      try {
        const authUrl = socialMediaService.getAuthUrl(platform, clientId, redirectUri);
        window.location.href = authUrl;
      } catch (err) {
        setError(`Failed to initiate ${platform} connection`);
        console.error(err);
      }
    },
    []
  );

  const completeConnection = useCallback(
    async (
      platform: Platform,
      code: string,
      clientId: string,
      clientSecret: string,
      redirectUri: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const tokenData = await socialMediaService.exchangeToken(
          platform,
          code,
          clientId,
          clientSecret,
          redirectUri
        );

        // In a real app, this would be stored in a secure backend
        const connection: SocialMediaConnection = {
          id: `${platform}-${Date.now()}`,
          platform,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : undefined,
          userId: tokenData.user_id || '',
          username: tokenData.username || '',
          displayName: tokenData.display_name || '',
          connectedAt: new Date(),
        };

        setConnections((prev) => [...prev, connection]);
        return connection;
      } catch (err) {
        const errorMsg = `Failed to connect ${platform}`;
        setError(errorMsg);
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const disconnectPlatform = useCallback((connectionId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId));
  }, []);

  const postToMultiplePlatforms = useCallback(
    async (
      selectedPlatforms: Platform[],
      content: PostContent,
      additionalParams?: Record<string, any>
    ) => {
      setLoading(true);
      setError(null);
      const results = [];

      try {
        for (const platform of selectedPlatforms) {
          const connection = connections.find((c) => c.platform === platform);
          if (!connection) {
            results.push({
              platform,
              success: false,
              error: `Not connected to ${platform}`,
            });
            continue;
          }

          try {
            const result = await socialMediaService.postContent(
              platform,
              connection.accessToken,
              { ...content, platform },
              { ...additionalParams, userId: connection.userId }
            );

            results.push({
              platform,
              success: true,
              postId: result.id || result.data?.id,
            });
          } catch (err) {
            results.push({
              platform,
              success: false,
              error: `Failed to post to ${platform}`,
            });
          }
        }

        return results;
      } finally {
        setLoading(false);
      }
    },
    [connections]
  );

  const syncAnalytics = useCallback(
    async (platform: Platform) => {
      setLoading(true);
      setError(null);
      try {
        const connection = connections.find((c) => c.platform === platform);
        if (!connection) {
          setError(`Not connected to ${platform}`);
          return null;
        }

        const analyticsData = await socialMediaService.getAnalytics(
          platform,
          connection.accessToken,
          { userId: connection.userId }
        );

        const platformAnalytics: PlatformAnalytics = {
          platform,
          followers: analyticsData.follower_count || analyticsData.subscribers_count || 0,
          totalReach: analyticsData.reach || 0,
          engagement: analyticsData.engagement || 0,
          engagementRate:
            analyticsData.engagement_rate || 0,
          recentPosts: [],
        };

        setAnalytics((prev) => ({
          ...prev,
          [platform]: platformAnalytics,
        }));

        return platformAnalytics;
      } catch (err) {
        setError(`Failed to sync ${platform} analytics`);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [connections]
  );

  const syncAllAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const platforms: Platform[] = ['twitter', 'instagram', 'tiktok', 'youtube'];
      const results = await Promise.all(
        platforms.map((platform) =>
          syncAnalytics(platform).catch(() => null)
        )
      );
      return results.filter(Boolean);
    } finally {
      setLoading(false);
    }
  }, [syncAnalytics]);

  return {
    connections,
    loading,
    error,
    analytics,
    initiateConnection,
    completeConnection,
    disconnectPlatform,
    postToMultiplePlatforms,
    syncAnalytics,
    syncAllAnalytics,
  };
};
