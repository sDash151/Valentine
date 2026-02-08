'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to entrance after a brief moment
    const timer = setTimeout(() => {
      router.push('/entrance');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-rose via-cream to-warm-gold">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 p-8"
      >
        <motion.h1
          className="font-serif text-6xl md:text-8xl text-deep-rose"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Valentine Week
        </motion.h1>
        <motion.p
          className="font-script text-3xl md:text-4xl text-deep-rose/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Something special is waiting...
        </motion.p>
        <motion.div
          className="mt-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-6xl">♥</div>
        </motion.div>
      </motion.div>
    </main>
  );
}
