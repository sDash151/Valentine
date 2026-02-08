# 💝 Valentine Week Surprise Website

A private, romantic, time-locked Valentine Week experience built with Next.js, React, and Tailwind CSS. This is a deeply personal digital love letter designed for a long-distance relationship.

## ✨ Features

- 🔒 **Private & Secure**: Password-protected with no public indexing
- ⏰ **Time-Locked Surprises**: Server-validated unlock times prevent manipulation
- 📱 **Mobile-First**: Optimized for iPhone and mobile devices
- 🎨 **Premium Design**: Warm, intimate aesthetic with paper textures and soft animations
- 💌 **Multiple Content Types**: Letters, photos, videos, voice notes, quizzes, playlists
- 🎭 **Animations**: Framer Motion page transitions, Lottie micro-interactions
- 🎵 **Audio Experience**: Background music and voice note playback with Howler.js
- 📸 **Memory Lane**: Scrapbook-style relationship timeline
- 🎁 **Easter Eggs**: Hidden surprises to discover
- 📊 **Progress Tracking**: See unlocked surprises and completion status
- 💾 **Downloadable Keepsakes**: Save special moments as images/PDFs
- 🔧 **Admin Panel**: Easy content management for creating surprises

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 4 with custom theme
- **Animations**: Framer Motion, Lottie
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Media CDN**: Cloudinary
- **Audio**: Howler.js
- **Testing**: Vitest, React Testing Library, fast-check (PBT)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudinary account
- Vercel account (for deployment)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd valentine-week
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your credentials:
   - Supabase URL and keys
   - Cloudinary credentials
   - JWT secret
   - Admin and user credentials

4. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the SQL migrations in `lib/db/migrations/` (to be created in Task 2)
   - Enable Row Level Security (RLS) policies

5. **Set up Cloudinary**:
   - Create a Cloudinary account
   - Create an upload preset (unsigned for client uploads)
   - Add credentials to `.env.local`

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📁 Project Structure

```
valentine-week/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   ├── (protected)/         # Protected user routes
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── animations/          # Animation components
│   ├── auth/                # Authentication components
│   ├── surprises/           # Surprise content renderers
│   ├── ui/                  # Reusable UI components
│   └── ...
├── lib/                     # Utility libraries
│   ├── supabase.ts          # Supabase client
│   ├── cloudinary.ts        # Cloudinary utilities
│   ├── auth.ts              # Authentication utilities
│   └── time-lock.ts         # Time validation logic
├── types/                   # TypeScript type definitions
├── tests/                   # Test files
├── public/                  # Static assets
└── ...
```

## 🎨 Design System

### Color Palette
- **Soft Rose**: `#F7C6CE` - Main accent color
- **Deep Rose**: `#E05A6A` - Primary interactive elements
- **Warm Gold**: `#FFD08A` - Accent highlights
- **Cream**: `#FFF8F4` - Background
- **Midnight**: `#0F1724` - Optional dark mode

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Script**: Dancing Script (for personal touches)

### Visual Style
- Paper grain texture overlay
- Soft vignette on edges
- Polaroid-style photo frames
- Gentle gradients
- Tactile, diary-like aesthetic

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 Development Workflow

Follow the implementation plan in `.kiro/specs/valentine-week-surprise/tasks.md`:

1. ✅ Project Setup and Infrastructure
2. Database Schema and Models
3. Authentication System
4. Time-Lock System
5. Media Management
6. UI Components (Entrance, Hero, Surprises)
7. Animations and Micro-interactions
8. Admin Panel
9. Security Implementation
10. Performance Optimization
11. PWA Features
12. Final Testing and Deployment

## 🔐 Security Features

- Server-side time validation
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on auth endpoints
- Input sanitization
- Signed media URLs with expiration
- CORS policies
- No public indexing

## 📱 PWA Support

The site can be installed as a Progressive Web App on mobile devices:
- Offline access to unlocked content
- App icons and splash screens
- Standalone display mode

## 🚢 Deployment

Deploy to Vercel:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📖 Content Management

Use the admin panel at `/admin` to:
- Create new surprises
- Upload media (images, videos, audio)
- Set unlock dates and times
- Preview surprises before publishing
- Edit or delete existing content

## 💡 Tips for Personalization

1. **Use inside jokes** in captions and messages
2. **Include her nickname** throughout the experience
3. **Reference specific memories** with dates and details
4. **Add voice notes** with your actual voice
5. **Create custom playlists** of songs meaningful to you both
6. **Hide easter eggs** with private messages
7. **Use real photos** from your relationship

## 🎯 Emotional Design Principles

- **Specificity over generic**: If another person could relate, it's too generic
- **Anticipation**: Time-locking creates excitement
- **Memory**: Relationship timeline tells your story
- **Intimacy**: Private, exclusive, just for her
- **Warmth**: Soft colors, gentle animations, no corporate feel

## 📄 License

Private project - All rights reserved

## 💖 Built with Love

This is not just a website. It's a digital love letter, a treasure chest of memories, and a week-long experience designed to make someone feel deeply loved and thought about.

---

**Remember**: The magic isn't in the code or animations. It's in the specificity, the inside jokes, the real moments, and the feeling that "someone thought about me while building this."
