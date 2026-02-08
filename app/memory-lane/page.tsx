'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MemoryLanePage() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      if (data.success) {
        setMemories(data.data || []);
      }
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💝</div>
          <p className="font-sans text-deep-rose/60">Loading memories...</p>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📸</div>
          <p className="font-sans text-deep-rose/60 mb-4">No memories yet</p>
          <Link href="/admin">
            <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm">
              Add Memories in Admin
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 py-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-script text-6xl md:text-7xl text-deep-rose mb-4">
          Our Memory Lane
        </h1>
        <p className="font-sans text-deep-rose/60 text-sm">
          scroll slowly
        </p>
      </motion.div>

      {/* Scrapbook Layout */}
      <div className="max-w-4xl mx-auto space-y-20 pb-32">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={`
              flex flex-col items-center
              ${memory.position === 'left' && 'md:items-start'}
              ${memory.position === 'right' && 'md:items-end'}
              ${memory.position === 'center' && 'md:items-center'}
            `}
          >
            {/* Polaroid Photo */}
            <motion.div
              className="relative bg-white p-4 pb-16 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              style={{
                rotate: memory.rotation || 0,
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            >
              {/* Tape Effect */}
              <div 
                className="absolute -top-4 left-1/2 w-20 h-8 bg-warm-gold/30 backdrop-blur-sm border-l border-r border-warm-gold/40" 
                style={{ 
                  transform: `translateX(-50%) rotate(${(memory.rotation || 0) * -0.5}deg)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} 
              />
              
              {/* Photo */}
              <div className="w-80 h-80 bg-gradient-to-br from-soft-rose/20 to-deep-rose/20 relative overflow-hidden">
                {memory.photo_url ? (
                  <img
                    src={memory.photo_url}
                    alt={memory.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-deep-rose/30 font-script text-2xl">
                    [Photo {index + 1}]
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="mt-4 space-y-2">
                <p className="font-script text-sm text-deep-rose/60">{memory.date}</p>
                <p className="font-sans text-deep-rose leading-relaxed">
                  {memory.caption}
                </p>
              </div>

              {/* Handwritten heart */}
              <div className="absolute bottom-4 right-4 text-deep-rose/20 text-6xl font-script">
                ♥
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 text-deep-rose/10 text-8xl pointer-events-none">
        ♥
      </div>
      <div className="fixed bottom-20 left-10 text-warm-gold/10 text-6xl pointer-events-none">
        ✨
      </div>

      {/* Back Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
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

      {/* Music Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMusicPlaying(!musicPlaying)}
        className={`
          fixed top-8 right-8 w-12 h-12 rounded-full shadow-lg border flex items-center justify-center transition-all duration-300
          ${musicPlaying 
            ? 'bg-deep-rose text-white border-deep-rose' 
            : 'bg-white/90 backdrop-blur-sm text-deep-rose border-deep-rose/20 hover:bg-deep-rose hover:text-white'
          }
        `}
      >
        {musicPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
