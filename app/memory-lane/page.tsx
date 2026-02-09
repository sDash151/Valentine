'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function MemoryLanePage() {
  const router = useRouter();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/entrance');
    }
  }, [router]);

  useEffect(() => {
    loadMemories();
  }, []);

  // Try to play audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
        // Browser blocked autoplay - will play when user interacts
      });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, memories.length]);

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

  const nextPage = () => {
    if (currentPage < memories.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
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
    <div className="h-screen w-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 flex items-center justify-center p-4 md:p-6 overflow-hidden fixed inset-0">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/memory-lane-music.mp3"
        loop
        autoPlay
        className="hidden"
      />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 text-center z-50"
      >
        <h1 className="font-script text-3xl md:text-4xl text-deep-rose mb-1">
          Our Memory Album
        </h1>
        <p className="font-sans text-deep-rose/60 text-xs">
          {currentPage + 1} of {memories.length}
        </p>
      </motion.div>

      {/* Photo Album Stack */}
      <div className="relative w-full max-w-lg md:max-w-md h-[70vh] md:h-[80vh] mx-auto">
        {/* Stack of photos behind - only show if there are more photos ahead and not animating */}
        <AnimatePresence>
          {currentPage < memories.length - 1 && memories.map((memory, index) => {
            if (index <= currentPage) return null;
            
            const offset = Math.min(index - currentPage, 3);
            
            return (
              <motion.div
                key={memory.id}
                className="absolute inset-0 bg-white rounded-2xl shadow-2xl pointer-events-none"
                style={{
                  zIndex: memories.length - index
                }}
                initial={false}
                animate={{
                  scale: 1 - (offset * 0.03),
                  y: offset * 8,
                  opacity: 1 - (offset * 0.15)
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            );
          })}
        </AnimatePresence>

        {/* Current Photo with Page Turn Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          {memories[currentPage] && (
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{
                rotateY: direction > 0 ? -90 : 90,
                opacity: 0,
                scale: 0.8
              }}
              animate={{
                rotateY: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              }}
              exit={{
                rotateY: direction > 0 ? 90 : -90,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.4 }
              }}
              className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6 md:p-6"
              style={{
                zIndex: 10,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #fef8f4 100%)'
              }}
            >
              {/* Decorative corner flourishes */}
              <div className="absolute top-3 left-3 text-deep-rose/10 text-2xl md:text-2xl">❀</div>
              <div className="absolute top-3 right-3 text-deep-rose/10 text-2xl md:text-2xl">❀</div>
              <div className="absolute bottom-3 left-3 text-warm-gold/10 text-2xl md:text-2xl">✿</div>
              <div className="absolute bottom-3 right-3 text-warm-gold/10 text-2xl md:text-2xl">✿</div>

              {/* Tape effect on top */}
              <div className="absolute -top-3 left-1/4 w-16 md:w-16 h-6 md:h-6 bg-warm-gold/20 backdrop-blur-sm border-l border-r border-warm-gold/30 shadow-sm" 
                style={{ transform: 'rotate(-5deg)' }} 
              />
              <div className="absolute -top-3 right-1/4 w-16 md:w-16 h-6 md:h-6 bg-warm-gold/20 backdrop-blur-sm border-l border-r border-warm-gold/30 shadow-sm" 
                style={{ transform: 'rotate(5deg)' }} 
              />

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl" 
                style={{
                  backgroundImage: 'radial-gradient(circle, #E05A6A 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Polaroid Style Photo */}
              <div className="h-full flex flex-col relative z-10">
                {/* Photo with decorative border */}
                <div className="flex-1 bg-gradient-to-br from-soft-rose/10 to-deep-rose/10 relative overflow-hidden rounded-lg mb-4 md:mb-4 flex items-center justify-center border-4 border-white shadow-inner">
                  {memories[currentPage].photo_url ? (
                    <img
                      src={memories[currentPage].photo_url}
                      alt={memories[currentPage].caption}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-deep-rose/30 font-script text-2xl">
                      [Photo {currentPage + 1}]
                    </div>
                  )}
                  
                  {/* Vintage overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  
                  {/* Photo corner decorations */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-deep-rose/20" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-deep-rose/20" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-deep-rose/20" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-deep-rose/20" />
                </div>

                {/* Decorative divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-deep-rose/20 to-transparent mb-3 md:mb-3" />

                {/* Caption Area with enhanced styling */}
                <div className="space-y-2 md:space-y-2 relative">
                  {/* Small decorative element */}
                  <div className="absolute -left-4 top-0 text-deep-rose/20 text-xl">♥</div>
                  
                  <p className="font-script text-base md:text-base text-deep-rose/60 italic">
                    {memories[currentPage].date}
                  </p>
                  <p className="font-sans text-sm md:text-sm text-deep-rose leading-relaxed line-clamp-3 md:line-clamp-2">
                    {memories[currentPage].caption}
                  </p>
                </div>

                {/* Large decorative heart with shadow */}
                <div className="absolute bottom-6 md:bottom-6 right-6 md:right-6 pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 text-deep-rose/5 text-4xl md:text-4xl font-script blur-sm">
                      ♥
                    </div>
                    <div className="relative text-deep-rose/10 text-4xl md:text-4xl font-script">
                      ♥
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50">
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all
            ${currentPage === 0
              ? 'bg-deep-rose/20 text-deep-rose/30 cursor-not-allowed'
              : 'bg-white/90 backdrop-blur-sm text-deep-rose hover:bg-deep-rose hover:text-white'
            }
          `}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50">
        <motion.button
          onClick={nextPage}
          disabled={currentPage === memories.length - 1}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all
            ${currentPage === memories.length - 1
              ? 'bg-deep-rose/20 text-deep-rose/30 cursor-not-allowed'
              : 'bg-white/90 backdrop-blur-sm text-deep-rose hover:bg-deep-rose hover:text-white'
            }
          `}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Page Dots Indicator */}
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {memories.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToPage(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentPage
                ? 'bg-deep-rose w-6 md:w-8'
                : 'bg-deep-rose/30 hover:bg-deep-rose/50'
              }
            `}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Link href="/home">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-2 md:py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-deep-rose/20 font-sans text-xs md:text-sm text-deep-rose hover:bg-deep-rose hover:text-white transition-colors"
          >
            ← Back to Home
          </motion.button>
        </Link>
      </div>

      {/* Keyboard Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-16 md:bottom-20 right-4 md:right-8 text-xs text-deep-rose/40 font-sans hidden lg:block"
      >
        Use ← → keys to navigate
      </motion.div>
    </div>
  );
}
