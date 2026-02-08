'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const mockStats = {
  totalSurprises: 7,
  unlockedSurprises: 2,
  viewedSurprises: 1,
  daysActive: 2,
  easterEggsFound: 0,
  totalEasterEggs: 3,
};

export default function StatsPage() {
  const progress = (mockStats.unlockedSurprises / mockStats.totalSurprises) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-script text-6xl md:text-7xl text-deep-rose mb-4">
          Your Journey
        </h1>
        <p className="font-sans text-deep-rose/60 text-sm">
          tracking your Valentine Week adventure
        </p>
      </motion.div>

      {/* Progress Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto mb-16"
      >
        <div className="relative w-64 h-64 mx-auto">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#F7C6CE"
              strokeWidth="16"
              fill="none"
              opacity="0.2"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 753' }}
              animate={{ strokeDasharray: `${(progress / 100) * 753} 753` }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E05A6A" />
                <stop offset="100%" stopColor="#FFD08A" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="font-serif text-5xl text-deep-rose mb-2">
                {mockStats.unlockedSurprises}/{mockStats.totalSurprises}
              </p>
              <p className="font-sans text-sm text-deep-rose/60">
                surprises unlocked
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {[
          { label: 'Surprises Viewed', value: mockStats.viewedSurprises, icon: '👀' },
          { label: 'Days Active', value: mockStats.daysActive, icon: '📅' },
          { label: 'Easter Eggs Found', value: `${mockStats.easterEggsFound}/${mockStats.totalEasterEggs}`, icon: '🥚' },
          { label: 'Memories Shared', value: '5', icon: '💭' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-deep-rose/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-deep-rose/60 mb-2">{stat.label}</p>
                <p className="font-serif text-4xl text-deep-rose">{stat.value}</p>
              </div>
              <div className="text-5xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="font-script text-3xl text-deep-rose text-center mb-8">
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Step', unlocked: true, icon: '🚶' },
            { name: 'Explorer', unlocked: false, icon: '🗺️' },
            { name: 'Collector', unlocked: false, icon: '💎' },
            { name: 'Completionist', unlocked: false, icon: '🏆' },
          ].map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`
                p-6 rounded-xl text-center transition-all
                ${achievement.unlocked
                  ? 'bg-gradient-to-br from-deep-rose to-warm-gold text-white shadow-lg'
                  : 'bg-white/50 text-deep-rose/30'
                }
              `}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="font-sans text-xs">{achievement.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="text-center">
        <Link href="/home">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-deep-rose/20 font-sans text-sm text-deep-rose hover:bg-deep-rose hover:text-white transition-colors"
          >
            ← Back to Home
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
