'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function EntrancePage() {
  const [isOpened, setIsOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [sitePassword, setSitePassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Generate random values only on client to avoid hydration mismatch
  const [heartPositions] = useState(() => 
    Array.from({ length: 20 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
      rotate: Math.random() * 360,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      finalRotate: Math.random() * 360 + 360
    }))
  );

  const [sparklePositions] = useState(() =>
    Array.from({ length: 6 }, () => ({
      initialX: Math.random() * 100 - 50,
      initialY: Math.random() * 100 - 50,
      finalX: Math.random() * 200 - 100,
      finalY: Math.random() * 200 - 100,
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 60
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user nickname and site password from settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserNickname(data.data.her_nickname || 'You');
          setSitePassword(data.data.site_password || '');
          setPasswordHint(data.data.password_hint || '');
        }
      })
      .catch(() => setUserNickname('You'));
  }, []);

  const handleEnvelopeClick = () => {
    setIsOpened(true);
    setTimeout(() => setShowMessage(true), 1000);
  };

  const handleContinue = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === sitePassword) {
      // Store authentication in localStorage
      localStorage.setItem('authenticated', 'true');
      router.push('/home');
    } else {
      setPasswordError('Incorrect password. Try again! 💕');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-rose via-cream to-warm-gold overflow-hidden relative">
      {/* Floating hearts background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heartPositions.map((heart, i) => (
            <motion.div
              key={i}
              className="absolute text-deep-rose/10 text-2xl"
              style={{ left: heart.x }}
              initial={{ 
                y: heart.y,
                rotate: heart.rotate
              }}
              animate={{ 
                y: -50,
                rotate: heart.finalRotate
              }}
              transition={{ 
                duration: heart.duration,
                repeat: Infinity,
                delay: heart.delay,
                ease: "linear"
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>
      )}

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
              {/* Premium Envelope Design */}
              <motion.div
                className="relative cursor-pointer group mx-auto"
                onClick={handleEnvelopeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '320px', height: '220px' }}
              >
                {/* Envelope Body - Realistic 3D */}
                <div className="absolute inset-0">
                  {/* Back of envelope */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cream to-soft-rose rounded-lg shadow-2xl border border-deep-rose/10" 
                    style={{
                      boxShadow: '0 20px 60px rgba(224, 90, 106, 0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                    }}
                  />
                  
                  {/* Envelope flap - Animated opening */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 origin-top"
                    style={{
                      height: '110px',
                      background: 'linear-gradient(135deg, #E05A6A 0%, #F7C6CE 100%)',
                      clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 4px 20px rgba(224, 90, 106, 0.4)'
                    }}
                    animate={{
                      rotateX: 0,
                    }}
                    whileHover={{
                      rotateX: -15,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Wax seal - Premium detail */}
                  <motion.div
                    className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative w-16 h-16">
                      {/* Wax seal base */}
                      <div className="absolute inset-0 bg-gradient-to-br from-warm-gold to-amber-600 rounded-full shadow-lg"
                        style={{
                          boxShadow: '0 4px 15px rgba(255, 208, 138, 0.6), inset 0 -2px 4px rgba(0,0,0,0.2)'
                        }}
                      />
                      {/* Wax texture */}
                      <div className="absolute inset-1 bg-gradient-to-br from-amber-400 to-warm-gold rounded-full opacity-50" />
                      {/* Heart emboss */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-deep-rose text-2xl font-bold drop-shadow-sm">♥</span>
                      </div>
                      {/* Shine effect */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-sm" />
                    </div>
                  </motion.div>
                  
                  {/* Paper edge detail */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-deep-rose/5 to-transparent" />
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(224, 90, 106, 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                />

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

              {/* Name with elegant typography */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <div className="relative inline-block">
                  <p className="font-script text-4xl text-deep-rose relative z-10">
                    For {userNickname || 'You'}
                  </p>
                  {/* Underline decoration */}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-deep-rose/40 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </div>
                <p className="text-sm text-deep-rose/60 font-sans italic">
                  from someone who thinks about you too much
                </p>
              </motion.div>

              {/* Tap hint with icon */}
              <motion.div
                className="flex items-center justify-center gap-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-5 h-5 text-deep-rose/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-xs text-deep-rose/40 font-sans">tap to open</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Letter with enhanced design */}
              <motion.div
                className="relative bg-cream/95 backdrop-blur-sm p-16 rounded-2xl shadow-2xl border border-deep-rose/10 max-w-2xl mx-auto overflow-hidden"
                initial={{ rotateY: 90, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
              >
                {/* Decorative corner flourishes */}
                <div className="absolute top-4 left-4 text-deep-rose/10 text-4xl">❀</div>
                <div className="absolute top-4 right-4 text-deep-rose/10 text-4xl">❀</div>
                <div className="absolute bottom-4 left-4 text-deep-rose/10 text-4xl">❀</div>
                <div className="absolute bottom-4 right-4 text-deep-rose/10 text-4xl">❀</div>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-soft-rose/5 via-transparent to-warm-gold/5 pointer-events-none" />

                {showMessage && !showPasswordPrompt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-10 space-y-8"
                  >
                    {/* Greeting with gentle fade-in */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="font-serif text-3xl text-deep-rose leading-relaxed"
                    >
                      Hi {userNickname || 'there'},
                    </motion.p>

                    {/* First line with staggered animation */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="font-serif text-xl text-deep-rose/80 leading-relaxed"
                    >
                      this is not a website.
                    </motion.p>

                    {/* Second line with staggered animation */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="font-serif text-xl text-deep-rose/80 leading-relaxed"
                    >
                      It's just a few feelings I didn't know how to send.
                    </motion.p>

                    {/* Decorative divider */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="w-32 h-px bg-gradient-to-r from-transparent via-deep-rose/30 to-transparent mx-auto my-8"
                    />

                    {/* Button with enhanced hover effects */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                      className="text-center pt-4"
                    >
                      <motion.button
                        onClick={handleContinue}
                        className="relative group px-10 py-4 bg-gradient-to-r from-deep-rose to-soft-rose text-white rounded-full font-sans text-base shadow-lg overflow-hidden"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(224, 90, 106, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "200%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                        
                        <span className="relative z-10 flex items-center gap-2">
                          open it
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </span>
                      </motion.button>

                      {/* Subtle hint text */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="text-xs text-deep-rose/40 font-sans mt-4"
                      >
                        something special is waiting for you
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Password Prompt */}
                {showPasswordPrompt && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 space-y-6"
                  >
                    <motion.p
                      className="font-serif text-2xl text-deep-rose text-center"
                    >
                      One last thing...
                    </motion.p>

                    <motion.p
                      className="font-sans text-base text-deep-rose/70 text-center"
                    >
                      Enter the password to continue 🔐
                    </motion.p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                          }}
                          placeholder="Enter password..."
                          className="w-full px-6 py-3 rounded-full border-2 border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-center bg-white"
                          autoFocus
                        />
                        {passwordError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-deep-rose/60 text-center mt-2"
                          >
                            {passwordError}
                          </motion.p>
                        )}
                        
                        {/* Hint Section */}
                        {passwordHint && (
                          <div className="mt-4 text-center">
                            {!showHint ? (
                              <motion.button
                                type="button"
                                onClick={() => setShowHint(true)}
                                className="text-xs text-deep-rose/50 hover:text-deep-rose underline font-sans"
                                whileHover={{ scale: 1.05 }}
                              >
                                Need a hint? 💭
                              </motion.button>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-warm-gold/10 rounded-lg border border-warm-gold/30"
                              >
                                <p className="text-sm text-deep-rose/70 font-sans">
                                  💡 {passwordHint}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full px-10 py-4 bg-gradient-to-r from-deep-rose to-soft-rose text-white rounded-full font-sans text-base shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(224, 90, 106, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue →
                      </motion.button>
                    </form>

                    <motion.button
                      onClick={() => {
                        setShowPasswordPrompt(false);
                        setShowHint(false);
                        setPasswordError('');
                      }}
                      className="text-sm text-deep-rose/50 hover:text-deep-rose underline font-sans mx-auto block"
                    >
                      ← Go back
                    </motion.button>
                  </motion.div>
                )}

                {/* Floating sparkles */}
                {showMessage && mounted && (
                  <>
                    {sparklePositions.map((sparkle, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-deep-rose/20 text-sm"
                        initial={{ 
                          x: sparkle.initialX,
                          y: sparkle.initialY,
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{ 
                          x: sparkle.finalX,
                          y: sparkle.finalY,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          rotate: 360
                        }}
                        transition={{ 
                          duration: 3,
                          delay: 1.5 + i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                        style={{
                          left: `${sparkle.left}%`,
                          top: `${sparkle.top}%`
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
