// Core Types for Valentine Week Surprise Website

export enum ContentType {
  LETTER = 'letter',
  PHOTO = 'photo',
  VIDEO = 'video',
  VOICE_NOTE = 'voice_note',
  QUIZ = 'quiz',
  PLAYLIST = 'playlist',
  MEMORY_TIMELINE = 'memory_timeline',
  MIXED = 'mixed',
}

export interface Surprise {
  id: string;
  title: string;
  unlock_date: string; // ISO 8601 UTC timestamp
  content_type: ContentType;
  content_payload: Record<string, any>;
  media_urls: string[];
  locked_hint: string;
  is_unlocked: boolean;
  is_viewed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  role: 'user' | 'admin';
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface AccessToken {
  id: string;
  token: string;
  user_id: string;
  expires_at: string;
  is_magic_link: boolean;
  created_at: string;
}

export interface Memory {
  id: string;
  date: string;
  photo_url: string;
  caption: string;
  rotation: number; // -5 to 5 degrees
  position: 'left' | 'center' | 'right';
  order_index: number;
  created_at: string;
}

export interface EasterEgg {
  id: string;
  identifier: string;
  message: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  surprise_id: string;
  is_viewed: boolean;
  viewed_at: string | null;
  created_at: string;
}

export interface UnlockStatus {
  is_unlocked: boolean;
  time_remaining_ms: number;
  unlock_date: string;
}

// API Response Types

export interface SurpriseListResponse {
  surprises: Array<{
    id: string;
    title: string;
    unlock_date: string;
    content_type: ContentType;
    locked_hint: string;
    is_unlocked: boolean;
    is_viewed: boolean;
    time_remaining_ms: number;
    order_index: number;
  }>;
  total_count: number;
  unlocked_count: number;
}

export interface SurpriseDetailResponse {
  id: string;
  title: string;
  unlock_date: string;
  content_type: ContentType;
  content_payload: Record<string, any>;
  media_urls: Array<{
    url: string;
    type: 'image' | 'video' | 'audio';
    thumbnail?: string;
  }>;
  is_unlocked: boolean;
  is_viewed: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    nickname: string;
    role: string;
  };
  error?: string;
}


// Content Payload Types for different surprise types

export interface LetterContent {
  text: string;
  signature?: string;
  font?: 'serif' | 'script';
}

export interface PhotoContent {
  caption: string;
  rotation?: number;
  filter?: string;
}

export interface VideoContent {
  caption?: string;
  thumbnail?: string;
  duration?: number;
}

export interface VoiceNoteContent {
  duration: number;
  waveform?: number[];
  transcript?: string;
}

export interface QuizContent {
  question: string;
  options?: string[];
  correct_answer: string;
  hint?: string;
  reward_message?: string;
}

export interface PlaylistContent {
  platform: 'spotify' | 'youtube' | 'apple_music';
  playlist_id: string;
  playlist_url: string;
  title: string;
  description?: string;
}

export interface MemoryTimelineContent {
  memories: Array<{
    date: string;
    title: string;
    description: string;
    photo_url?: string;
  }>;
}

export interface MixedContent {
  items: Array<{
    type: 'text' | 'image' | 'video' | 'audio';
    content: any;
    order: number;
  }>;
}

// Utility Types

export type SurpriseContentPayload =
  | LetterContent
  | PhotoContent
  | VideoContent
  | VoiceNoteContent
  | QuizContent
  | PlaylistContent
  | MemoryTimelineContent
  | MixedContent;

export interface CreateSurpriseInput {
  title: string;
  unlock_date: string;
  content_type: ContentType;
  content_payload: SurpriseContentPayload;
  media_files?: File[];
  locked_hint: string;
  order_index: number;
}

export interface UpdateSurpriseInput extends Partial<CreateSurpriseInput> {
  id: string;
}

// Animation Types

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'bloom' | 'typewriter' | 'confetti' | 'hearts';
  duration?: number;
  delay?: number;
  easing?: string;
}

// Audio Types

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

// Form Types

export interface LoginFormData {
  password: string;
}

export interface MagicLinkFormData {
  email: string;
}

// API Error Types

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// Database Types (matching Supabase schema)

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      surprises: {
        Row: Surprise;
        Insert: Omit<Surprise, 'id' | 'created_at' | 'updated_at' | 'is_unlocked' | 'is_viewed'>;
        Update: Partial<Omit<Surprise, 'id' | 'created_at' | 'updated_at'>>;
      };
      memories: {
        Row: Memory;
        Insert: Omit<Memory, 'id' | 'created_at'>;
        Update: Partial<Omit<Memory, 'id' | 'created_at'>>;
      };
      easter_eggs: {
        Row: EasterEgg;
        Insert: Omit<EasterEgg, 'id' | 'created_at'>;
        Update: Partial<Omit<EasterEgg, 'id' | 'created_at'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at'>;
        Update: Partial<Omit<UserProgress, 'id' | 'created_at'>>;
      };
    };
  };
}
