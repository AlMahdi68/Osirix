import { create } from 'zustand';
import { SocialMediaConnection } from '../api/socialMediaAPI';
import { ScheduledPost } from '../api/schedulingService';
import { AutoRunWorkflow, DigitalProduct, UserSubscription, UsageMetrics, GeneratedVideo, GeneratedCharacter, GeneratedVoice } from '../types/index';

interface Post {
  id: string;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  status: 'draft' | 'scheduled' | 'published';
}

interface Character {
  id: string;
  name: string;
  style: string;
  image?: string;
  createdAt: Date;
}

interface AppState {
  posts: Post[];
  characters: Character[];
  selectedCharacter: Character | null;
  socialConnections: SocialMediaConnection[];
  scheduledPosts: ScheduledPost[];
  autoRunWorkflows: AutoRunWorkflow[];
  digitalProducts: DigitalProduct[];
  subscription: UserSubscription | null;
  monthlyUsage: UsageMetrics;
  generatedVideos: GeneratedVideo[];
  generatedCharacters: GeneratedCharacter[];
  generatedVoices: GeneratedVoice[];
  
  // Post actions
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  
  // Character actions
  addCharacter: (character: Character) => void;
  selectCharacter: (character: Character) => void;
  deleteCharacter: (id: string) => void;
  
  // Social connection actions
  addSocialConnection: (connection: SocialMediaConnection) => void;
  removeSocialConnection: (connectionId: string) => void;
  updateSocialConnection: (connectionId: string, updates: Partial<SocialMediaConnection>) => void;
  
  // Scheduled post actions
  addScheduledPost: (post: ScheduledPost) => void;
  updateScheduledPost: (postId: string, updates: Partial<ScheduledPost>) => void;
  removeScheduledPost: (postId: string) => void;
  
  // AutoRun workflow actions
  addAutoRunWorkflow: (workflow: AutoRunWorkflow) => void;
  updateAutoRunWorkflow: (workflowId: string, updates: Partial<AutoRunWorkflow>) => void;
  deleteAutoRunWorkflow: (workflowId: string) => void;
  
  // Digital product actions
  addDigitalProduct: (product: DigitalProduct) => void;
  updateDigitalProduct: (productId: string, updates: Partial<DigitalProduct>) => void;
  deleteDigitalProduct: (productId: string) => void;
  
  // Subscription actions
  setSubscription: (subscription: UserSubscription) => void;
  
  // Usage tracking
  incrementVideoUsage: () => void;
  incrementCharacterUsage: () => void;
  incrementVoiceUsage: () => void;
  incrementPostUsage: () => void;
  
  // Generated content actions
  addGeneratedVideo: (video: GeneratedVideo) => void;
  addGeneratedCharacter: (character: GeneratedCharacter) => void;
  addGeneratedVoice: (voice: GeneratedVoice) => void;
}

export const useAppStore = create<AppState>((set) => ({
  posts: [],
  characters: [],
  selectedCharacter: null,
  socialConnections: [],
  scheduledPosts: [],
  autoRunWorkflows: [],
  digitalProducts: [],
  subscription: { planId: 'free', startDate: new Date(), active: true, monthlyUsage: { videosGenerated: 0, charactersCreated: 0, voicesGenerated: 0, postsScheduled: 0, autoRunExecutions: 0, productsCreated: 0 } },
  monthlyUsage: { videosGenerated: 0, charactersCreated: 0, voicesGenerated: 0, postsScheduled: 0, autoRunExecutions: 0, productsCreated: 0 },
  generatedVideos: [],
  generatedCharacters: [],
  generatedVoices: [],
  
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),
  
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
  
  addCharacter: (character) =>
    set((state) => ({
      characters: [character, ...state.characters],
    })),
  
  selectCharacter: (character) =>
    set(() => ({
      selectedCharacter: character,
    })),
  
  deleteCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      selectedCharacter:
        state.selectedCharacter?.id === id
          ? null
          : state.selectedCharacter,
    })),
  
  addSocialConnection: (connection) =>
    set((state) => ({
      socialConnections: [connection, ...state.socialConnections],
    })),
  
  removeSocialConnection: (connectionId) =>
    set((state) => ({
      socialConnections: state.socialConnections.filter((c) => c.id !== connectionId),
    })),
  
  updateSocialConnection: (connectionId, updates) =>
    set((state) => ({
      socialConnections: state.socialConnections.map((c) =>
        c.id === connectionId ? { ...c, ...updates } : c
      ),
    })),
  
  addScheduledPost: (post) =>
    set((state) => ({
      scheduledPosts: [post, ...state.scheduledPosts],
    })),
  
  updateScheduledPost: (postId, updates) =>
    set((state) => ({
      scheduledPosts: state.scheduledPosts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p
      ),
    })),
  
  removeScheduledPost: (postId) =>
    set((state) => ({
      scheduledPosts: state.scheduledPosts.filter((p) => p.id !== postId),
    })),
  
  addAutoRunWorkflow: (workflow) =>
    set((state) => ({
      autoRunWorkflows: [workflow, ...state.autoRunWorkflows],
    })),
  
  updateAutoRunWorkflow: (workflowId, updates) =>
    set((state) => ({
      autoRunWorkflows: state.autoRunWorkflows.map((w) =>
        w.id === workflowId ? { ...w, ...updates } : w
      ),
    })),
  
  deleteAutoRunWorkflow: (workflowId) =>
    set((state) => ({
      autoRunWorkflows: state.autoRunWorkflows.filter((w) => w.id !== workflowId),
    })),
  
  addDigitalProduct: (product) =>
    set((state) => ({
      digitalProducts: [product, ...state.digitalProducts],
    })),
  
  updateDigitalProduct: (productId, updates) =>
    set((state) => ({
      digitalProducts: state.digitalProducts.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
      ),
    })),
  
  deleteDigitalProduct: (productId) =>
    set((state) => ({
      digitalProducts: state.digitalProducts.filter((p) => p.id !== productId),
    })),
  
  setSubscription: (subscription) =>
    set(() => ({
      subscription,
    })),
  
  incrementVideoUsage: () =>
    set((state) => ({
      monthlyUsage: {
        ...state.monthlyUsage,
        videosGenerated: state.monthlyUsage.videosGenerated + 1,
      },
    })),
  
  incrementCharacterUsage: () =>
    set((state) => ({
      monthlyUsage: {
        ...state.monthlyUsage,
        charactersCreated: state.monthlyUsage.charactersCreated + 1,
      },
    })),
  
  incrementVoiceUsage: () =>
    set((state) => ({
      monthlyUsage: {
        ...state.monthlyUsage,
        voicesGenerated: state.monthlyUsage.voicesGenerated + 1,
      },
    })),
  
  incrementPostUsage: () =>
    set((state) => ({
      monthlyUsage: {
        ...state.monthlyUsage,
        postsScheduled: state.monthlyUsage.postsScheduled + 1,
      },
    })),
  
  addGeneratedVideo: (video) =>
    set((state) => ({
      generatedVideos: [video, ...state.generatedVideos],
    })),
  
  addGeneratedCharacter: (character) =>
    set((state) => ({
      generatedCharacters: [character, ...state.generatedCharacters],
    })),
  
  addGeneratedVoice: (voice) =>
    set((state) => ({
      generatedVoices: [voice, ...state.generatedVoices],
    })),
}));
