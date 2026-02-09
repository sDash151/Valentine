'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

export default function SurprisePage() {
  const params = useParams();
  const router = useRouter();
  const [isRevealing, setIsRevealing] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState(200); // Start with high intensity
  const [confettiInFront, setConfettiInFront] = useState(true); // Control z-index
  const [typedText, setTypedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [surprise, setSurprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [surpriseId, setSurpriseId] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<('correct' | 'partial' | 'incorrect' | null)[]>([]);
  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [revealedQuizzes, setRevealedQuizzes] = useState<boolean[]>([]); // Track which quizzes are revealed

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/entrance');
    }
  }, [router]);

  // Handle params (which might be async in Next.js 15)
  useEffect(() => {
    const getId = async () => {
      const rawId = typeof params.id === 'string' ? params.id : await params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (id) {
        setSurpriseId(id);
      }
    };
    getId();
  }, [params]);

  // Load surprise from database
  useEffect(() => {
    if (surpriseId) {
      fetch(`/api/surprises/${surpriseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setSurprise(data.data);
            // Mark as viewed in localStorage
            localStorage.setItem(`viewed_${surpriseId}`, 'true');
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [surpriseId]);

  useEffect(() => {
    // Bloom animation
    const timer1 = setTimeout(() => {
      setIsRevealing(false);
      setShowContent(true);
      setShowConfetti(true); // Start confetti and keep it going!
    }, 2000);

    // Move confetti to background after 4 seconds
    const zIndexTimer = setTimeout(() => {
      setConfettiInFront(false);
    }, 6000); // 2s bloom + 4s in front = 6s total

    // Gradually reduce confetti intensity over 10 seconds
    const intensityTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setConfettiIntensity(prev => {
          const newIntensity = prev - 5; // Reduce by 5 pieces every 500ms
          if (newIntensity <= 30) {
            clearInterval(interval);
            return 30; // Minimum subtle background confetti
          }
          return newIntensity;
        });
      }, 500);
    }, 3000); // Start reducing after 3 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(zIndexTimer);
      clearTimeout(intensityTimer);
    };
  }, []);

  // Typewriter effect for letters and mixed content
  useEffect(() => {
    const hasLetterContent = (surprise?.content_type === 'letter' || surprise?.content_type === 'mixed') 
      && showContent 
      && surprise?.content_payload?.text;

    if (hasLetterContent) {
      const lines = surprise.content_payload.text.split('\n\n');
      if (currentLineIndex < lines.length) {
        const currentLine = lines[currentLineIndex];
        let charIndex = 0;

        const typeInterval = setInterval(() => {
          if (charIndex <= currentLine.length) {
            setTypedText(prev => {
              const allPreviousLines = lines.slice(0, currentLineIndex).join('\n\n');
              return allPreviousLines + (allPreviousLines ? '\n\n' : '') + currentLine.slice(0, charIndex);
            });
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(() => {
              setCurrentLineIndex(prev => prev + 1);
            }, 500);
          }
        }, 50);

        return () => clearInterval(typeInterval);
      }
    }
  }, [currentLineIndex, showContent, surprise]);

  // Quiz answer handler
  const handleQuizSubmit = (questionIndex: number, userAnswer: string, correctAnswer: string) => {
    const userLower = userAnswer.trim().toLowerCase();
    const correctLower = correctAnswer.trim().toLowerCase();
    
    // Check if exact match or if the correct answer is contained in user's answer
    const isExactMatch = userLower === correctLower;
    const isPartialMatch = userLower.includes(correctLower);
    const isCorrect = isExactMatch || isPartialMatch;
    
    setQuizResults(prev => {
      const newResults = [...prev];
      newResults[questionIndex] = isCorrect ? (isExactMatch ? 'correct' : 'partial') : 'incorrect';
      return newResults;
    });

    if (!isCorrect) {
      setShowHints(prev => {
        const newHints = [...prev];
        newHints[questionIndex] = true;
        return newHints;
      });
    } else {
      // Show confetti for correct answer
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-soft-rose">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💝</div>
          <p className="font-sans text-deep-rose/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!surprise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-soft-rose">
        <div className="text-center">
          <p className="font-sans text-deep-rose mb-4">Surprise not found</p>
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-2 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Get photos, videos, audio from media_urls
  const photos = surprise.media_urls?.filter((url: string) => 
    url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  ) || [];
  
  const videos = surprise.media_urls?.filter((url: string) => 
    url.match(/\.(mp4|mov|avi|webm)$/i)
  ) || [];
  
  const audio = surprise.media_urls?.filter((url: string) => 
    url.match(/\.(mp3|wav|m4a|ogg)$/i)
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/20 to-warm-gold/30 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className={confettiInFront ? 'fixed inset-0 z-50 pointer-events-none' : 'fixed inset-0 z-0 pointer-events-none'}>
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 300}
            height={typeof window !== 'undefined' ? window.innerHeight : 200}
            recycle={true}
            numberOfPieces={confettiIntensity}
            colors={['#F7C6CE', '#E05A6A', '#FFD08A', '#FFF8F4']}
            gravity={0.15}
            wind={0.01}
          />
        </div>
      )}

      {/* Bloom Animation */}
      <AnimatePresence>
        {isRevealing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-deep-rose to-soft-rose"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 20, opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <motion.div
              className="text-white text-8xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ♥
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <div className="max-w-2xl w-full">
              {/* Letter Type */}
              {surprise.content_type === 'letter' && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm p-12 md:p-16 rounded-lg shadow-2xl border border-deep-rose/10"
                >
                  <div className="space-y-6">
                    <h2 className="font-script text-4xl text-deep-rose mb-8">
                      {surprise.title}
                    </h2>
                    
                    <div className="font-serif text-xl text-deep-rose/90 leading-relaxed whitespace-pre-wrap">
                      {typedText}
                      {currentLineIndex < surprise.content_payload.text.split('\n\n').length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-0.5 h-6 bg-deep-rose ml-1"
                        />
                      )}
                    </div>

                    {currentLineIndex >= surprise.content_payload.text.split('\n\n').length && surprise.content_payload.signature && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-script text-2xl text-deep-rose/70 text-right mt-8"
                      >
                        {surprise.content_payload.signature}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Photo Type */}
              {surprise.content_type === 'photo' && photos.length > 0 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-8"
                >
                  <h2 className="font-script text-4xl text-deep-rose text-center">
                    {surprise.title}
                  </h2>
                  
                  {/* Polaroid Style */}
                  <div className="bg-white p-6 pb-20 shadow-2xl mx-auto max-w-md">
                    <img
                      src={photos[0]}
                      alt={surprise.title}
                      className="w-full aspect-square object-cover"
                    />
                    {surprise.content_payload?.caption && (
                      <p className="mt-6 font-sans text-deep-rose text-center">
                        {surprise.content_payload.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Video Type */}
              {surprise.content_type === 'video' && videos.length > 0 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-8"
                >
                  <h2 className="font-script text-4xl text-deep-rose text-center">
                    {surprise.title}
                  </h2>
                  
                  <div className="bg-white/90 p-6 rounded-lg shadow-2xl">
                    <video
                      src={videos[0]}
                      controls
                      className="w-full aspect-video rounded-lg"
                    />
                    {surprise.content_payload?.caption && (
                      <p className="mt-4 font-sans text-deep-rose text-center">
                        {surprise.content_payload.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Voice Note Type */}
              {surprise.content_type === 'voice_note' && audio.length > 0 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-8"
                >
                  <h2 className="font-script text-4xl text-deep-rose text-center">
                    {surprise.title}
                  </h2>
                  
                  <div className="bg-white/90 p-12 rounded-lg shadow-2xl text-center">
                    <div className="text-6xl mb-6">🎤</div>
                    <audio
                      src={audio[0]}
                      controls
                      autoPlay
                      loop={audio.length === 1}
                      className="w-full max-w-md mx-auto"
                    />
                    {audio.length > 1 && (
                      <p className="font-sans text-sm text-deep-rose/60 mt-4">
                        Playing 1 of {audio.length} audio messages
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quiz Type */}
              {surprise.content_type === 'quiz' && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10"
                >
                  <h2 className="font-script text-4xl text-deep-rose mb-8 text-center">
                    {surprise.title}
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="font-serif text-2xl text-deep-rose text-center">
                      {surprise.content_payload?.question}
                    </p>
                    
                    <div className="flex justify-center">
                      <input
                        type="text"
                        placeholder="Your answer..."
                        className="px-6 py-3 rounded-lg border-2 border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-center"
                      />
                    </div>

                    <div className="text-center">
                      <button className="px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans">
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Playlist Type */}
              {surprise.content_type === 'playlist' && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-8"
                >
                  <h2 className="font-script text-4xl text-deep-rose text-center">
                    {surprise.title}
                  </h2>
                  
                  <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                    <div className="text-center space-y-6">
                      <div className="text-6xl">🎵</div>
                      <h3 className="font-serif text-2xl text-deep-rose">
                        {surprise.content_payload?.title}
                      </h3>
                      <a
                        href={surprise.content_payload?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
                      >
                        Listen Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mixed Content Type */}
              {surprise.content_type === 'mixed' && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-16"
                >
                  <h2 className="font-script text-4xl text-deep-rose text-center mb-12">
                    {surprise.title}
                  </h2>

                  {/* Letter part with typewriter */}
                  {surprise.content_payload?.text && (
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10"
                    >
                      <div className="font-serif text-xl text-deep-rose/90 leading-relaxed whitespace-pre-wrap">
                        {typedText}
                        {currentLineIndex < surprise.content_payload.text.split('\n\n').length && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-6 bg-deep-rose ml-1"
                          />
                        )}
                      </div>
                      {currentLineIndex >= surprise.content_payload.text.split('\n\n').length && surprise.content_payload.signature && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="font-script text-2xl text-deep-rose/70 text-right mt-8"
                        >
                          {surprise.content_payload.signature}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  {/* Handwritten divider */}
                  {(photos.length > 0 || videos.length > 0 || audio.length > 0) && surprise.content_payload?.text && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-center py-8"
                    >
                      <p className="font-script text-3xl text-deep-rose/60">
                        And here's something special...
                      </p>
                      <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-deep-rose/30 to-transparent mx-auto mt-4" />
                    </motion.div>
                  )}

                  {/* Photos part - Polaroid scrapbook style */}
                  {photos.length > 0 && (
                    <div className="space-y-12">
                      {photos.map((photo: string, index: number) => {
                        // Get caption from media_captions if available
                        const mediaItem = surprise.content_payload?.media_captions?.find(
                          (m: any) => m.url === photo && m.type === 'photo'
                        );
                        const caption = mediaItem?.caption || `Memory ${index + 1}`;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0, rotate: 0 }}
                            animate={{ 
                              y: 0, 
                              opacity: 1, 
                              rotate: index % 2 === 0 ? -2 : 2 
                            }}
                            transition={{ 
                              delay: 2 + (index * 0.4),
                              type: "spring",
                              stiffness: 100
                            }}
                            className={`relative max-w-md mx-auto ${
                              index % 2 === 0 ? 'mr-auto ml-8' : 'ml-auto mr-8'
                            }`}
                          >
                            {/* Tape effect */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-amber-100/40 backdrop-blur-sm rotate-[-5deg] z-10 shadow-sm" />
                            
                            {/* Polaroid frame */}
                            <div className="bg-white p-4 pb-16 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                              <div className="relative overflow-hidden">
                                <img
                                  src={photo}
                                  alt={caption}
                                  className="w-full aspect-square object-cover"
                                />
                                {/* Vintage overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                              </div>
                              
                              {/* Handwritten caption */}
                              <div className="mt-4 text-center">
                                <p className="font-script text-lg text-deep-rose/70">
                                  {caption}
                                </p>
                              </div>
                            </div>

                            {/* Shadow effect */}
                            <div className="absolute inset-0 -z-10 bg-deep-rose/5 blur-xl translate-y-4" />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Video part - Vintage film frame */}
                  {videos.length > 0 && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 2 + (photos.length * 0.4) + 0.5,
                        type: "spring"
                      }}
                      className="max-w-3xl mx-auto"
                    >
                      {/* Film strip decoration */}
                      <div className="relative">
                        {/* Top film strip */}
                        <div className="absolute -top-6 left-0 right-0 h-6 bg-deep-rose/10 flex items-center justify-around px-2">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-3 h-4 bg-deep-rose/20 rounded-sm" />
                          ))}
                        </div>

                        {/* Video container */}
                        <div className="bg-gradient-to-br from-deep-rose/5 to-warm-gold/5 p-6 rounded-lg shadow-2xl">
                          <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                            <video
                              src={videos[0]}
                              controls
                              className="w-full aspect-video"
                            />
                          </div>
                          
                          {/* Film caption */}
                          <div className="mt-4 text-center">
                            <p className="font-script text-xl text-deep-rose">
                              {(() => {
                                const mediaItem = surprise.content_payload?.media_captions?.find(
                                  (m: any) => m.url === videos[0] && m.type === 'video'
                                );
                                return mediaItem?.caption || 'A moment captured in time 🎬';
                              })()}
                            </p>
                          </div>
                        </div>

                        {/* Bottom film strip */}
                        <div className="absolute -bottom-6 left-0 right-0 h-6 bg-deep-rose/10 flex items-center justify-around px-2">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-3 h-4 bg-deep-rose/20 rounded-sm" />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Audio part - Vintage record player style */}
                  {audio.length > 0 && (
                    <motion.div
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 2 + (photos.length * 0.4) + (videos.length > 0 ? 1 : 0.5),
                        type: "spring"
                      }}
                      className="max-w-md mx-auto"
                    >
                      <div className="bg-gradient-to-br from-deep-rose/10 to-warm-gold/10 p-8 rounded-2xl shadow-2xl border border-deep-rose/20">
                        {/* Vinyl record decoration */}
                        <div className="relative mb-6">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-deep-rose/20 to-deep-rose/40 shadow-lg"
                          >
                            <div className="absolute inset-4 rounded-full bg-white/90" />
                            <div className="absolute inset-12 rounded-full bg-deep-rose/30" />
                          </motion.div>
                        </div>

                        {/* Audio player */}
                        <div className="text-center space-y-4">
                          <p className="font-script text-2xl text-deep-rose">
                            Listen to my heart 🎤
                          </p>
                          <audio
                            src={audio[0]}
                            controls
                            autoPlay
                            loop={audio.length === 1}
                            className="w-full"
                          />
                          {audio.length > 1 && (
                            <p className="font-sans text-xs text-deep-rose/60">
                              Playing 1 of {audio.length} audio messages
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Quiz part */}
                  {surprise.content_payload?.quiz_questions && surprise.content_payload.quiz_questions.length > 0 && (
                    <div className="space-y-8">
                      {surprise.content_payload.quiz_questions.map((quiz: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            delay: 2 + (photos.length * 0.4) + (videos.length > 0 ? 1 : 0) + (audio.length > 0 ? 0.5 : 0) + (index * 0.3),
                            type: "spring"
                          }}
                          className="max-w-2xl mx-auto"
                        >
                          {!revealedQuizzes[index] ? (
                            // Mystery box - click to reveal
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const newRevealed = [...revealedQuizzes];
                                newRevealed[index] = true;
                                setRevealedQuizzes(newRevealed);
                              }}
                              className="bg-gradient-to-br from-deep-rose/10 to-warm-gold/10 backdrop-blur-sm p-12 rounded-lg shadow-2xl border-2 border-deep-rose/30 cursor-pointer hover:border-deep-rose/50 transition-all"
                            >
                              <div className="text-center space-y-4">
                                <motion.div
                                  animate={{ 
                                    rotate: [0, -10, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1, 1.1, 1]
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                  }}
                                  className="text-7xl"
                                >
                                  🎁
                                </motion.div>
                                <h3 className="font-script text-3xl text-deep-rose">
                                  A Question for You
                                </h3>
                                <p className="font-sans text-deep-rose/70">
                                  Question {index + 1} of {surprise.content_payload.quiz_questions.length}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className="px-8 py-3 bg-deep-rose text-white rounded-full font-sans shadow-lg"
                                >
                                  Click to Open 💝
                                </motion.button>
                              </div>
                            </motion.div>
                          ) : (
                            // Revealed quiz
                            <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                            <div className="space-y-6">
                              <div className="text-center mb-6">
                                <span className="text-4xl">❓</span>
                                <p className="font-sans text-sm text-deep-rose/60 mt-2">Question {index + 1}</p>
                              </div>
                              
                              <p className="font-serif text-2xl text-deep-rose text-center">
                                {quiz.question}
                              </p>
                              
                              {quizResults[index] === null || quizResults[index] === undefined ? (
                                <>
                                  <div className="flex justify-center">
                                    <input
                                      type="text"
                                      value={quizAnswers[index] || ''}
                                      onChange={(e) => {
                                        const newAnswers = [...quizAnswers];
                                        newAnswers[index] = e.target.value;
                                        setQuizAnswers(newAnswers);
                                      }}
                                      placeholder="Your answer..."
                                      className="px-6 py-3 rounded-lg border-2 border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-center"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleQuizSubmit(index, quizAnswers[index] || '', quiz.answer);
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="text-center">
                                    <button 
                                      onClick={() => handleQuizSubmit(index, quizAnswers[index] || '', quiz.answer)}
                                      className="px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
                                    >
                                      Submit Answer
                                    </button>
                                  </div>

                                  {showHints[index] && quiz.hint && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-center p-4 bg-warm-gold/10 rounded-lg border border-warm-gold/30"
                                    >
                                      <p className="font-sans text-sm text-deep-rose/70">
                                        💡 Hint: {quiz.hint}
                                      </p>
                                    </motion.div>
                                  )}
                                </>
                              ) : (
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-center space-y-4"
                                >
                                  {quizResults[index] === 'correct' ? (
                                    <>
                                      <div className="text-6xl">🎉</div>
                                      <p className="font-serif text-2xl text-green-600">Perfect!</p>
                                      <p className="font-sans text-deep-rose/70">You know me so well! 💕</p>
                                    </>
                                  ) : quizResults[index] === 'partial' ? (
                                    <>
                                      <div className="text-6xl">✨</div>
                                      <p className="font-serif text-2xl text-green-600">Yeah, you're right!</p>
                                      <p className="font-sans text-deep-rose/70">I love how you remember the details! 💕</p>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-6xl">💭</div>
                                      <p className="font-serif text-2xl text-deep-rose">Not quite...</p>
                                      <p className="font-sans text-sm text-deep-rose/60">The answer was: <span className="font-semibold">{quiz.answer}</span></p>
                                      <button
                                        onClick={() => {
                                          const newResults = [...quizResults];
                                          newResults[index] = null;
                                          setQuizResults(newResults);
                                          const newHints = [...showHints];
                                          newHints[index] = false;
                                          setShowHints(newHints);
                                        }}
                                        className="px-6 py-2 bg-deep-rose/10 text-deep-rose rounded-full hover:bg-deep-rose/20 transition-colors font-sans text-sm"
                                      >
                                        Try Again
                                      </button>
                                    </>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Playlist part */}
                  {surprise.content_payload?.url && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 2 + (photos.length * 0.4) + (videos.length > 0 ? 1 : 0) + (audio.length > 0 ? 0.5 : 0) + ((surprise.content_payload?.quiz_questions?.length || 0) * 0.3),
                        type: "spring"
                      }}
                      className="max-w-2xl mx-auto"
                    >
                      <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                        <div className="text-center space-y-6">
                          <div className="text-6xl">🎵</div>
                          <h3 className="font-serif text-2xl text-deep-rose">
                            {surprise.content_payload.title || 'A Special Playlist'}
                          </h3>
                          <p className="font-sans text-deep-rose/60">
                            Songs that remind me of you
                          </p>
                          <a
                            href={surprise.content_payload.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
                          >
                            Listen Now
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Final flourish */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 + (photos.length * 0.4) + (videos.length > 0 ? 1 : 0) }}
                    className="text-center pt-8"
                  >
                    <p className="font-script text-2xl text-deep-rose/60">
                      Made with love, just for you ♥
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-center"
              >
                <button className="text-deep-rose/60 hover:text-deep-rose font-sans text-sm underline underline-offset-4 transition-colors">
                  keep this
                </button>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={() => router.push('/home')}
                  className="px-8 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-deep-rose/20 font-sans text-sm text-deep-rose hover:bg-deep-rose hover:text-white transition-colors"
                >
                  ← Back to Home
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
