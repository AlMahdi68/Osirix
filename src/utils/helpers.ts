// Helper functions for Osirix

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'EUR',
  }).format(amount);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateEngagementRate = (likes: number, views: number): number => {
  if (views === 0) return 0;
  return (likes / views) * 100;
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

export const canUseFeature = (currentUsage: number, limit: number): boolean => {
  return currentUsage < limit;
};

export const getUsagePercentage = (current: number, limit: number): number => {
  return Math.min((current / limit) * 100, 100);
};

export const generateMockVideoUrl = (): string => {
  return 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs' as any;
};

export const generateMockCharacterImage = (style: string): string => {
  const colors = {
    'Cartoon': '#FFB6C1',
    'Anime': '#FFD700',
    'Realistic': '#CD853F',
    '3D': '#87CEEB',
    'Illustrated': '#98FB98',
  };
  const color = colors[style as keyof typeof colors] || '#FFB6C1';
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='${encodeURIComponent(color)}' width='200' height='200'/%3E%3Ccircle cx='100' cy='100' r='80' fill='white' opacity='0.3'/%3E%3C/svg%3E`;
};

export const generateMockAudioUrl = (): string => {
  return 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==' as any;
};

export const sampleCharacterConfigs = [
  {
    name: 'Sarah',
    gender: 'Female',
    ethnicity: 'Caucasian',
    style: 'Realistic',
    skinTone: 'Fair',
    hairStyle: 'Long Straight',
    hairColor: 'Brown',
    outfit: 'Professional Blazer',
    expression: 'Friendly Smile',
  },
  {
    name: 'Alex',
    gender: 'Male',
    ethnicity: 'Asian',
    style: 'Anime',
    skinTone: 'Tan',
    hairStyle: 'Short Spiky',
    hairColor: 'Black',
    outfit: 'Casual T-Shirt',
    expression: 'Confident',
  },
  {
    name: 'Emma',
    gender: 'Female',
    ethnicity: 'African',
    style: 'Cartoon',
    skinTone: 'Dark',
    hairStyle: 'Curly Afro',
    hairColor: 'Brown',
    outfit: 'Colorful Dress',
    expression: 'Happy',
  },
];

export const sampleVoiceTypes = [
  { type: 'Male - Deep', language: 'English' },
  { type: 'Male - Young', language: 'English' },
  { type: 'Female - Soft', language: 'English' },
  { type: 'Female - Energetic', language: 'English' },
  { type: 'Narrator - Professional', language: 'English' },
];

export const sampleVideoPrompts = [
  'Create a motivational fitness video about morning workouts',
  'Generate a cooking tutorial for homemade pasta',
  'Make a travel vlog about Tokyo street food',
  'Create a tech review for the latest smartphone',
  'Generate a meditation and mindfulness tutorial',
];
