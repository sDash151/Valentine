'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EntrancePage() {
  const [isOpened, setIsOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const router = useRouter();

  // Fetch user nickname from settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserNickname(data.data.her_nickname || 'You');
        }
      })
      .catch(() => setUserNickname('You'));
  }, []);

  const handleEnvelopeClick = () => {
    setIsOpened(true);
    setTimeout(() => setShowMessage(true), 1000);
  };

  const handleContinue = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-rose via-cream to-warm-gold overflow-hidden relative">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-deep-rose/10 text-2xl"
            initial={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000, 
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: -50,
              rotate: Math.random() * 360 + 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Envelope */}
              <motion.div
                className="relative cursor-pointer group"
                onClick={handleEnvelopeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-64 h-48 mx-auto relative">
                  {/* Envelope body */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cream to-soft-rose rounded-lg shadow-2xl border-2 border-deep-rose/20" />
                  
                  {/* Envelope flap */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-deep-rose to-soft-rose origin-top"
                    style={{
                      clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                      transformStyle: 'preserve-3d'
                    }}
                    animate={{
                      rotateX: 0,
                    }}
                  />
                  
                  {/* Seal */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-warm-gold rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-deep-rose text-2xl">♥</span>
                  </div>
                </div>

                {/* Pulse animation */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(224, 90, 106, 0.4)',
                      '0 0 0 20px rgba(224, 90, 106, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <p className="font-script text-3xl text-deep-rose">
                  For {userNickname || 'You'}
                </p>
                <p className="text-sm text-deep-rose/60 font-sans">
                  from someone who thinks about you too much
                </p>
              </motion.div>

              {/* Tap hint */}
              <motion.p
                className="text-xs text-deep-rose/40 font-sans"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                tap to open
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Letter */}
              <motion.div
                className="bg-cream/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10 max-w-xl mx-auto"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8 }}
              >
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="space-y-6"
                  >
                    <p className="font-serif text-2xl text-deep-rose leading-relaxed">
                      Hi {userNickname || 'there'},
                    </p>
                    <p className="font-serif text-lg text-deep-rose/80 leading-relaxed">
                      this is not a website.
                    </p>
                    <p className="font-serif text-lg text-deep-rose/80 leading-relaxed">
                      It's just a few feelings I didn't know how to send.
                    </p>
                    
                    <motion.button
                      onClick={handleContinue}
                      className="mt-8 text-deep-rose/60 hover:text-deep-rose font-sans text-sm underline underline-offset-4 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      open it
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
