'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const [surprises, setSurprises] = useState<any[]>([]);
  const [settings, setSettings] = useState({ her_nickname: 'love' });
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load surprises
      const surprisesRes = await fetch('/api/surprises');
      const surprisesData = await surprisesRes.json();
      if (surprisesData.success) {
        setSurprises(surprisesData.data || []);
      }

      // Load settings
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setSettings(settingsData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = surprises.filter(s => new Date(s.unlock_date) <= new Date()).length;
  const totalCount = surprises.length;
  const nextSurprise = surprises.find(s => new Date(s.unlock_date) > new Date());

  useEffect(() => {
    if (!nextSurprise) return;

    const updateCountdown = () => {
      const now = new Date();
      const unlock = new Date(nextSurprise.unlock_date);
      const diff = unlock.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Unlocked!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextSurprise]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💝</div>
          <p className="font-sans text-deep-rose/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/20 to-warm-gold/30">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-5xl md:text-6xl text-deep-rose mb-4"
        >
          Welcome back, {settings.her_nickname || 'love'} ♥
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-deep-rose/60 text-sm"
        >
          {unlockedCount} of {totalCount} surprises unlocked
        </motion.p>
      </header>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <div className="h-2 bg-deep-rose/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-deep-rose to-warm-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Countdown Card */}
      {nextSurprise && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto px-6 mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-deep-rose/10">
            <p className="font-sans text-sm text-deep-rose/60 mb-2">Next surprise unlocks in</p>
            <p className="font-serif text-4xl text-deep-rose mb-4">{timeRemaining}</p>
            <p className="font-script text-xl text-deep-rose/80">{nextSurprise.title}</p>
          </div>
        </motion.div>
      )}

      {/* Surprises Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {surprises.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-sans text-deep-rose/60 mb-4">No surprises yet</p>
            <Link href="/admin">
              <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm">
                Add Surprises in Admin
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surprises.map((surprise, index) => {
              const isUnlocked = new Date(surprise.unlock_date) <= new Date();
              
              return (
                <motion.div
                  key={surprise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                href={isUnlocked ? `/surprise/${surprise.id}` : '#'}
                className={`block ${!isUnlocked && 'pointer-events-none'}`}
              >
                <div
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300
                    ${isUnlocked
                      ? 'bg-white/90 border-deep-rose/20 hover:border-deep-rose hover:shadow-xl cursor-pointer'
                      : 'bg-deep-rose/5 border-deep-rose/10 opacity-50'
                    }
                  `}
                >
                  {/* Lock Icon */}
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4 text-deep-rose/30">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-soft-rose to-deep-rose rounded-full flex items-center justify-center text-white text-2xl">
                      {isUnlocked ? '♥' : '🔒'}
                    </div>
                    <h3 className="font-serif text-xl text-deep-rose">{surprise.title}</h3>
                    <p className="font-sans text-sm text-deep-rose/60">
                      {new Date(surprise.unlock_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {surprise.locked_hint && !isUnlocked && (
                      <p className="font-sans text-xs text-deep-rose/40 italic">
                        {surprise.locked_hint}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect */}
                  {isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-deep-rose/5 to-warm-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.02 }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <Link href="/memory-lane">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-deep-rose/20 font-sans text-sm text-deep-rose hover:bg-deep-rose hover:text-white transition-colors"
          >
            Memory Lane
          </motion.button>
        </Link>
        <Link href="/stats">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-deep-rose/20 font-sans text-sm text-deep-rose hover:bg-deep-rose hover:text-white transition-colors"
          >
            Progress
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
