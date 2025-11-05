/**
 * Social Media API Integration Services
 * Handles OAuth authentication and API calls for all platforms
 */

export type Platform = 'twitter' | 'instagram' | 'tiktok' | 'youtube';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface SocialMediaConnection {
  id: string;
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  followers?: number;
  connectedAt: Date;
}

export interface PostContent {
  caption: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  scheduledTime?: Date;
  platform: Platform;
}

export interface SocialMediaPost {
  id: string;
  platform: Platform;
  platformPostId: string;
  caption: string;
  mediaUrl?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: Date;
}

export interface PlatformAnalytics {
  platform: Platform;
  followers: number;
  totalReach: number;
  engagement: number;
  engagementRate: number;
  topPost?: SocialMediaPost;
  recentPosts: SocialMediaPost[];
}

// Twitter/X API Service
export const twitterAPI = {
  getAuthUrl: (clientId: string, redirectUri: string) => {
    const state = Math.random().toString(36).substring(7);
    const scope = encodeURIComponent('tweet.write tweet.read users.read follows.write follows.read');
    return `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=${scope}`;
  },

  exchangeToken: async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
    try {
      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: 'challenge',
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Twitter token exchange failed:', error);
      throw error;
    }
  },

  postTweet: async (accessToken: string, content: PostContent) => {
    try {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content.caption,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Twitter post failed:', error);
      throw error;
    }
  },

  getAnalytics: async (accessToken: string) => {
    try {
      const response = await fetch('https://api.twitter.com/2/users/me/tweets?max_results=10&metrics=public_metrics', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error('Twitter analytics fetch failed:', error);
      throw error;
    }
  },
};

// Instagram API Service
export const instagramAPI = {
  getAuthUrl: (clientId: string, redirectUri: string) => {
    const scope = encodeURIComponent('user_profile,user_media');
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  },

  exchangeToken: async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
    try {
      const response = await fetch('https://graph.instagram.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Instagram token exchange failed:', error);
      throw error;
    }
  },

  postContent: async (accessToken: string, content: PostContent, userId: string) => {
    try {
      // First upload the image/video
      const uploadResponse = await fetch(
        `https://graph.instagram.com/v18.0/${userId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caption: content.caption,
            media_type: content.mediaType === 'video' ? 'VIDEO' : 'IMAGE',
            image_url: content.mediaUrl,
            access_token: accessToken,
          }),
        }
      );

      const mediaData = await uploadResponse.json();

      // Then publish it
      const publishResponse = await fetch(
        `https://graph.instagram.com/v18.0/${userId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: mediaData.id,
            access_token: accessToken,
          }),
        }
      );

      return publishResponse.json();
    } catch (error) {
      console.error('Instagram post failed:', error);
      throw error;
    }
  },

  getAnalytics: async (accessToken: string, userId: string) => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/v18.0/${userId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`
      );
      return response.json();
    } catch (error) {
      console.error('Instagram analytics fetch failed:', error);
      throw error;
    }
  },
};

// TikTok API Service
export const tiktokAPI = {
  getAuthUrl: (clientId: string, redirectUri: string) => {
    const scope = encodeURIComponent('user.info.basic,video.upload,video.list');
    return `https://www.tiktok.com/v1/oauth/authorize?client_key=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
  },

  exchangeToken: async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
    try {
      const response = await fetch('https://open.tiktokapis.com/v1/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('TikTok token exchange failed:', error);
      throw error;
    }
  },

  uploadVideo: async (accessToken: string, videoFile: File, caption: string) => {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('description', caption);

      const response = await fetch('https://open.tiktokapis.com/v1/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });
      return response.json();
    } catch (error) {
      console.error('TikTok video upload failed:', error);
      throw error;
    }
  },

  getAnalytics: async (accessToken: string) => {
    try {
      const response = await fetch('https://open.tiktokapis.com/v1/user/info/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error('TikTok analytics fetch failed:', error);
      throw error;
    }
  },
};

// YouTube API Service
export const youtubeAPI = {
  getAuthUrl: (clientId: string, redirectUri: string) => {
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly'
    );
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&access_type=offline`;
  },

  exchangeToken: async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('YouTube token exchange failed:', error);
      throw error;
    }
  },

  uploadVideo: async (accessToken: string, videoFile: File, title: string, description: string) => {
    try {
      const formData = new FormData();
      const metadata = {
        snippet: {
          title,
          description,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      };

      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', videoFile);

      const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      return response.json();
    } catch (error) {
      console.error('YouTube video upload failed:', error);
      throw error;
    }
  },

  getAnalytics: async (accessToken: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      return response.json();
    } catch (error) {
      console.error('YouTube analytics fetch failed:', error);
      throw error;
    }
  },
};

// Generic Social Media Service
export const socialMediaService = {
  getAuthUrl: (platform: Platform, clientId: string, redirectUri: string): string => {
    const services = {
      twitter: twitterAPI.getAuthUrl,
      instagram: instagramAPI.getAuthUrl,
      tiktok: tiktokAPI.getAuthUrl,
      youtube: youtubeAPI.getAuthUrl,
    };
    return services[platform](clientId, redirectUri);
  },

  exchangeToken: async (
    platform: Platform,
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ) => {
    const services = {
      twitter: twitterAPI.exchangeToken,
      instagram: instagramAPI.exchangeToken,
      tiktok: tiktokAPI.exchangeToken,
      youtube: youtubeAPI.exchangeToken,
    };
    return services[platform](code, clientId, clientSecret, redirectUri);
  },

  postContent: async (
    platform: Platform,
    accessToken: string,
    content: PostContent,
    additionalParams?: Record<string, any>
  ) => {
    const services = {
      twitter: () => twitterAPI.postTweet(accessToken, content),
      instagram: () =>
        instagramAPI.postContent(accessToken, content, additionalParams?.userId || ''),
      tiktok: () =>
        tiktokAPI.uploadVideo(accessToken, additionalParams?.videoFile, content.caption),
      youtube: () =>
        youtubeAPI.uploadVideo(
          accessToken,
          additionalParams?.videoFile,
          additionalParams?.title || content.caption,
          additionalParams?.description || ''
        ),
    };
    return services[platform]();
  },

  getAnalytics: async (platform: Platform, accessToken: string, additionalParams?: Record<string, any>) => {
    const services = {
      twitter: () => twitterAPI.getAnalytics(accessToken),
      instagram: () =>
        instagramAPI.getAnalytics(accessToken, additionalParams?.userId || ''),
      tiktok: () => tiktokAPI.getAnalytics(accessToken),
      youtube: () => youtubeAPI.getAnalytics(accessToken),
    };
    return services[platform]();
  },
};
