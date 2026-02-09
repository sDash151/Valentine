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
  const router = useRouter();

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
                {showMessage && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-deep-rose/20 text-sm"
                        initial={{ 
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 - 50,
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{ 
                          x: Math.random() * 200 - 100,
                          y: Math.random() * 200 - 100,
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
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`
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
