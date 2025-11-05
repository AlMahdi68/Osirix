export interface Post {
  id: string;
  title: string;
  description: string;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter';
  videoUrl?: string;
  voiceUrl?: string;
  characterId?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export interface Character {
  id: string;
  name: string;
  ethnicity: string;
  gender: string;
  style: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  expression: string;
  imageUrl?: string;
  animations: string[];
  createdAt: Date;
}

export interface Analytics {
  totalImpressions: number;
  totalEngagement: number;
  engagementRate: number;
  followerGrowth: number;
  platformStats: Record<string, PlatformStats>;
  topPosts: Post[];
}

export interface PlatformStats {
  platform: string;
  followers: number;
  avgViews: number;
  engagement: number;
  revenue: number;
}

export interface MonetizationStrategy {
  id: string;
  title: string;
  description: string;
  platform: string;
  revenue: string;
  timeframe: string;
  steps: string[];
}

export interface AIMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface SocialMediaConfig {
  platform: 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface SocialMediaUser {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  followers: number;
  following?: number;
  bio?: string;
}

export interface SocialMediaStats {
  followers: number;
  following?: number;
  totalPosts: number;
  totalEngagement: number;
  avgEngagementRate: number;
  topPost?: Post;
}

// AutoRun Agent Types
export interface AutoRunWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: 'daily' | 'weekly' | 'custom';
  lastRun?: Date;
  nextRun?: Date;
  config: AutoRunConfig;
  stats: AutoRunStats;
}

export interface AutoRunConfig {
  contentStrategy: string;
  videoStyle: 'Cinematic' | 'Animated' | 'Artistic';
  platforms: string[];
  timezone: string;
  postTime: string;
  includeCharacter: boolean;
  characterId?: string;
  includeVoice: boolean;
  autoMonetize: boolean;
  maxDailyPosts: number;
}

export interface AutoRunStats {
  totalVideosGenerated: number;
  totalPostsPublished: number;
  totalEngagement: number;
  totalRevenue: number;
  successRate: number;
  lastErrors?: string[];
}

// Digital Product Types
export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  productType: 'course' | 'ebook' | 'template' | 'guide' | 'masterclass';
  price: number;
  content: ProductContent[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  sales: number;
  revenue: number;
  status: 'draft' | 'published' | 'archived';
}

export interface ProductContent {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'video' | 'file' | 'link';
  content: string;
  order: number;
}

// Pricing Plans
export interface PricingPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  description: string;
  features: PlanFeature[];
  limits: PlanLimits;
  popular?: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface PlanLimits {
  monthlyVideos: number;
  monthlyCharacters: number;
  monthlyVoices: number;
  scheduledPosts: number;
  autoRunWorkflows: number;
  digitalProducts: number;
  maxProductPrice: number;
  customBranding: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
}

// User Subscription
export interface UserSubscription {
  planId: 'free' | 'pro' | 'enterprise';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  active: boolean;
  monthlyUsage: UsageMetrics;
}

export interface UsageMetrics {
  videosGenerated: number;
  charactersCreated: number;
  voicesGenerated: number;
  postsScheduled: number;
  autoRunExecutions: number;
  productsCreated: number;
}

// AI Generation Types
export interface GeneratedVideo {
  id: string;
  prompt: string;
  style: 'Cinematic' | 'Animated' | 'Artistic';
  duration: number;
  videoUrl?: string;
  thumbnail?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
}

export interface GeneratedCharacter {
  id: string;
  name: string;
  attributes: CharacterAttributes;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
}

export interface CharacterAttributes {
  gender: string;
  ethnicity: string;
  style: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  expression: string;
}

export interface GeneratedVoice {
  id: string;
  text: string;
  voiceType: string;
  language: string;
  audioUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
}

// Payment
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  buyerEmail: string;
  createdAt: Date;
  completedAt?: Date;
}
