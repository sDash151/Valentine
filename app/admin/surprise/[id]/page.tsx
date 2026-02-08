'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

export default function EditSurprisePage() {
  const params = useParams();
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const [surpriseId, setSurpriseId] = useState<string | null>(null);

  // Handle params (which might be async in Next.js 15)
  useEffect(() => {
    const getId = async () => {
      const id = typeof params.id === 'string' ? params.id : await params.id;
      setSurpriseId(id);
      setIsNew(id === 'new');
    };
    getId();
  }, [params]);

  const [formData, setFormData] = useState({
    title: '',
    unlockDate: '',
    unlockTime: '00:00',
    contentType: 'letter',
    lockedHint: '',
    letterText: '',
    signature: '',
    photoCaption: '',
    videoCaption: '',
    quizQuestion: '',
    quizAnswer: '',
    quizHint: '',
    playlistUrl: '',
    playlistTitle: '',
  });

  const [files, setFiles] = useState<{
    photos: File[];
    videos: File[];
    audio: File[];
  }>({
    photos: [],
    videos: [],
    audio: [],
  });

  const [previews, setPreviews] = useState<{
    photos: string[];
    videos: string[];
    audio: string[];
  }>({
    photos: [],
    videos: [],
    audio: [],
  });

  // Captions for each media item
  const [mediaCaptions, setMediaCaptions] = useState<{
    photos: string[];
    videos: string[];
    audio: string[];
  }>({
    photos: [],
    videos: [],
    audio: [],
  });

  // Quiz questions array
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    answer: string;
    hint: string;
  }>>([]);
  const [loading, setLoading] = useState(!isNew);
  
  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    current: 0,
    total: 0,
    percentage: 0,
    currentFile: '',
  });

  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // Load existing surprise data when editing
  useEffect(() => {
    if (!isNew && surpriseId && surpriseId !== 'new') {
      loadSurpriseData();
    } else {
      setLoading(false);
    }
  }, [isNew, surpriseId]);

  const loadSurpriseData = async () => {
    // Don't try to load if surpriseId is undefined or 'new'
    if (!surpriseId || surpriseId === 'new') {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading surprise with ID:', surpriseId);
      const res = await fetch(`/api/surprises/${surpriseId}`);
      const data = await res.json();
      
      console.log('Surprise data received:', data);
      
      if (data.success && data.data) {
        const surprise = data.data;
        
        console.log('Full surprise object:', JSON.stringify(surprise, null, 2));
        console.log('Content payload:', surprise.content_payload);
        console.log('Content payload keys:', Object.keys(surprise.content_payload || {}));
        console.log('Media URLs:', surprise.media_urls);
        
        // Parse unlock date and time (handle timezone properly)
        const unlockDate = new Date(surprise.unlock_date);
        
        // Get local date string (YYYY-MM-DD)
        const year = unlockDate.getFullYear();
        const month = String(unlockDate.getMonth() + 1).padStart(2, '0');
        const day = String(unlockDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // Get local time string (HH:MM)
        const hours = String(unlockDate.getHours()).padStart(2, '0');
        const minutes = String(unlockDate.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        console.log('Parsed date:', dateStr, 'time:', timeStr);
        
        // Set form data - handle both mixed and specific content types
        const newFormData = {
          title: surprise.title || '',
          unlockDate: dateStr,
          unlockTime: timeStr,
          contentType: surprise.content_type || 'letter',
          lockedHint: surprise.locked_hint || '',
          letterText: surprise.content_payload?.text || '',
          signature: surprise.content_payload?.signature || '',
          photoCaption: surprise.content_payload?.caption || '',
          videoCaption: surprise.content_payload?.caption || '',
          quizQuestion: surprise.content_payload?.question || '',
          quizAnswer: surprise.content_payload?.answer || '',
          quizHint: surprise.content_payload?.hint || '',
          playlistUrl: surprise.content_payload?.url || '',
          playlistTitle: surprise.content_payload?.title || '',
        };
        
        console.log('Setting form data:', newFormData);
        setFormData(newFormData);

        // Load existing media URLs as previews
        if (surprise.media_urls && surprise.media_urls.length > 0) {
          const newPreviews = {
            photos: surprise.media_urls.filter((url: string) => 
              url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            ),
            videos: surprise.media_urls.filter((url: string) => 
              url.match(/\.(mp4|mov|avi|webm)$/i)
            ),
            audio: surprise.media_urls.filter((url: string) => 
              url.match(/\.(mp3|wav|m4a|ogg)$/i)
            ),
          };
          
          console.log('Setting previews:', newPreviews);
          setPreviews(newPreviews);

          // Load media captions from content_payload.media_captions
          const photoCaptions: string[] = [];
          const videoCaptions: string[] = [];
          const audioCaptions: string[] = [];

          if (surprise.content_payload?.media_captions && Array.isArray(surprise.content_payload.media_captions)) {
            surprise.content_payload.media_captions.forEach((item: any) => {
              if (item.type === 'photo') {
                photoCaptions.push(item.caption || '');
              } else if (item.type === 'video') {
                videoCaptions.push(item.caption || '');
              } else if (item.type === 'audio') {
                audioCaptions.push(item.caption || '');
              }
            });
          }

          // Ensure caption arrays match preview arrays length (fill with empty strings if needed)
          while (photoCaptions.length < newPreviews.photos.length) {
            photoCaptions.push('');
          }
          while (videoCaptions.length < newPreviews.videos.length) {
            videoCaptions.push('');
          }
          while (audioCaptions.length < newPreviews.audio.length) {
            audioCaptions.push('');
          }

          setMediaCaptions({
            photos: photoCaptions,
            videos: videoCaptions,
            audio: audioCaptions,
          });
        }

        // Load quiz questions from content_payload.quiz_questions
        if (surprise.content_payload?.quiz_questions && Array.isArray(surprise.content_payload.quiz_questions)) {
          setQuizQuestions(surprise.content_payload.quiz_questions);
        }
      } else {
        console.error('Failed to load surprise:', data.error);
        showModal('error', 'Load Failed', `Failed to load surprise: ${data.error}`);
      }
    } catch (error) {
      console.error('Error loading surprise:', error);
      showModal('error', 'Error', 'Error loading surprise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (type: 'photos' | 'videos' | 'audio', e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file sizes
    const maxSizes = {
      photos: 10 * 1024 * 1024, // 10MB
      videos: 100 * 1024 * 1024, // 100MB
      audio: 50 * 1024 * 1024, // 50MB
    };

    for (const file of selectedFiles) {
      if (file.size > maxSizes[type]) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxMB = (maxSizes[type] / (1024 * 1024)).toFixed(0);
        showModal(
          'error',
          'File Too Large',
          `${file.name} is ${sizeMB}MB. Maximum size for ${type} is ${maxMB}MB. Please compress the file and try again.`
        );
        return;
      }
    }

    setFiles(prev => ({ ...prev, [type]: [...prev[type], ...selectedFiles] }));
    
    // Initialize empty captions for new files
    setMediaCaptions(prev => ({
      ...prev,
      [type]: [...prev[type], ...selectedFiles.map(() => '')]
    }));

    // Create previews
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          [type]: [...prev[type], reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (type: 'photos' | 'videos' | 'audio', index: number) => {
    setFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
    setMediaCaptions(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateCaption = (type: 'photos' | 'videos' | 'audio', index: number, caption: string) => {
    setMediaCaptions(prev => ({
      ...prev,
      [type]: prev[type].map((c, i) => i === index ? caption : c)
    }));
  };

  // Quiz question management
  const addQuizQuestion = () => {
    setQuizQuestions(prev => [...prev, { question: '', answer: '', hint: '' }]);
  };

  const removeQuizQuestion = (index: number) => {
    setQuizQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuizQuestion = (index: number, field: 'question' | 'answer' | 'hint', value: string) => {
    setQuizQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Calculate total files to upload
      const totalFiles = files.photos.length + files.videos.length + files.audio.length;
      let uploadedFiles = 0;

      if (totalFiles > 0) {
        setUploadProgress({
          isUploading: true,
          current: 0,
          total: totalFiles,
          percentage: 0,
          currentFile: '',
        });
      }

      // Step 1: Upload NEW files to Cloudinary
      const newMediaUrls: string[] = [];
      
      // Upload photos
      for (const photo of files.photos) {
        setUploadProgress(prev => ({
          ...prev,
          currentFile: photo.name,
        }));

        const uploadFormData = new FormData();
        uploadFormData.append('file', photo);
        uploadFormData.append('type', 'image');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          newMediaUrls.push(uploadData.url);
          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100),
          }));
          console.log('Photo uploaded:', uploadData.url);
        } else {
          console.error('Photo upload failed:', uploadData.error);
          showModal('error', 'Upload Failed', `Failed to upload ${photo.name}: ${uploadData.error}`);
          setUploadProgress({ isUploading: false, current: 0, total: 0, percentage: 0, currentFile: '' });
          return;
        }
      }
      
      // Upload videos
      for (const video of files.videos) {
        setUploadProgress(prev => ({
          ...prev,
          currentFile: video.name,
        }));

        const uploadFormData = new FormData();
        uploadFormData.append('file', video);
        uploadFormData.append('type', 'video');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          newMediaUrls.push(uploadData.url);
          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100),
          }));
          console.log('Video uploaded:', uploadData.url);
        } else {
          console.error('Video upload failed:', uploadData.error);
          showModal('error', 'Upload Failed', `Failed to upload ${video.name}: ${uploadData.error}`);
          setUploadProgress({ isUploading: false, current: 0, total: 0, percentage: 0, currentFile: '' });
          return;
        }
      }
      
      // Upload audio
      for (const audio of files.audio) {
        setUploadProgress(prev => ({
          ...prev,
          currentFile: audio.name,
        }));

        const uploadFormData = new FormData();
        uploadFormData.append('file', audio);
        uploadFormData.append('type', 'audio');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          newMediaUrls.push(uploadData.url);
          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100),
          }));
          console.log('Audio uploaded:', uploadData.url);
        } else {
          console.error('Audio upload failed:', uploadData.error);
          showModal('error', 'Upload Failed', `Failed to upload ${audio.name}: ${uploadData.error}`);
          setUploadProgress({ isUploading: false, current: 0, total: 0, percentage: 0, currentFile: '' });
          return;
        }
      }

      // Reset upload progress
      setUploadProgress({ isUploading: false, current: 0, total: 0, percentage: 0, currentFile: '' });
      
      // Separate existing media URLs (from previews that are URLs) from new uploads
      const existingPhotos = previews.photos.filter(url => url.startsWith('http'));
      const existingVideos = previews.videos.filter(url => url.startsWith('http'));
      const existingAudios = previews.audio.filter(url => url.startsWith('http'));
      
      const allMediaUrls = [
        ...existingPhotos,
        ...existingVideos,
        ...existingAudios,
        ...newMediaUrls
      ];
      
      // Build media objects with captions
      const mediaWithCaptions = [];
      
      // Add existing photos with their captions
      for (let i = 0; i < existingPhotos.length; i++) {
        mediaWithCaptions.push({
          url: existingPhotos[i],
          type: 'photo',
          caption: mediaCaptions.photos[i] || ''
        });
      }
      
      // Add existing videos with their captions
      for (let i = 0; i < existingVideos.length; i++) {
        mediaWithCaptions.push({
          url: existingVideos[i],
          type: 'video',
          caption: mediaCaptions.videos[i] || ''
        });
      }
      
      // Add existing audio with their captions
      for (let i = 0; i < existingAudios.length; i++) {
        mediaWithCaptions.push({
          url: existingAudios[i],
          type: 'audio',
          caption: mediaCaptions.audio[i] || ''
        });
      }
      
      // Add NEW photos with captions (from files.photos)
      let newUrlIndex = 0;
      for (let i = 0; i < files.photos.length; i++) {
        mediaWithCaptions.push({
          url: newMediaUrls[newUrlIndex],
          type: 'photo',
          caption: mediaCaptions.photos[existingPhotos.length + i] || ''
        });
        newUrlIndex++;
      }
      
      // Add NEW videos with captions
      for (let i = 0; i < files.videos.length; i++) {
        mediaWithCaptions.push({
          url: newMediaUrls[newUrlIndex],
          type: 'video',
          caption: mediaCaptions.videos[existingVideos.length + i] || ''
        });
        newUrlIndex++;
      }
      
      // Add NEW audio with captions
      for (let i = 0; i < files.audio.length; i++) {
        mediaWithCaptions.push({
          url: newMediaUrls[newUrlIndex],
          type: 'audio',
          caption: mediaCaptions.audio[existingAudios.length + i] || ''
        });
        newUrlIndex++;
      }
      
      // Step 2: Build content payload based on content type
      let contentPayload: any = {};
      
      switch (formData.contentType) {
        case 'letter':
          contentPayload = {
            text: formData.letterText,
            signature: formData.signature,
          };
          break;
        case 'photo':
          contentPayload = {
            caption: formData.photoCaption,
          };
          break;
        case 'video':
          contentPayload = {
            caption: formData.videoCaption,
          };
          break;
        case 'voice_note':
          contentPayload = {};
          break;
        case 'quiz':
          contentPayload = {
            question: formData.quizQuestion,
            answer: formData.quizAnswer,
            hint: formData.quizHint,
          };
          break;
        case 'playlist':
          contentPayload = {
            title: formData.playlistTitle,
            url: formData.playlistUrl,
          };
          break;
        case 'mixed':
          // For mixed content, include all fields that have values
          contentPayload = {
            text: formData.letterText || undefined,
            signature: formData.signature || undefined,
            quiz_questions: quizQuestions.length > 0 ? quizQuestions : undefined,
            title: formData.playlistTitle || undefined,
            url: formData.playlistUrl || undefined,
          };
          // Remove undefined values
          Object.keys(contentPayload).forEach(key => 
            contentPayload[key] === undefined && delete contentPayload[key]
          );
          break;
      }
      
      // Step 3: Combine date and time into ISO timestamp
      const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}:00`).toISOString();
      
      // Step 4: Get the next order_index (only for new surprises)
      let orderIndex = 1;
      if (isNew) {
        const surprisesRes = await fetch('/api/surprises');
        const surprisesData = await surprisesRes.json();
        orderIndex = surprisesData.data ? surprisesData.data.length + 1 : 1;
      } else {
        // For editing, fetch current order_index
        const currentRes = await fetch(`/api/surprises/${surpriseId}`);
        const currentData = await currentRes.json();
        orderIndex = currentData.data?.order_index || 1;
      }
      
      // Step 5: Save to Supabase
      const surpriseData = {
        title: formData.title,
        unlock_date: unlockDateTime,
        content_type: formData.contentType,
        content_payload: {
          ...contentPayload,
          media_captions: mediaWithCaptions // Store media with captions
        },
        media_urls: allMediaUrls, // Keep for backward compatibility
        locked_hint: formData.lockedHint || null,
        order_index: orderIndex,
      };
      
      const saveRes = await fetch(
        isNew ? '/api/surprises' : `/api/surprises/${surpriseId}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(surpriseData),
        }
      );
      
      const saveData = await saveRes.json();
      
      if (saveData.success) {
        showModal(
          'success',
          isNew ? 'Surprise Created!' : 'Surprise Updated!',
          isNew ? 'Your surprise has been created successfully. She\'s going to love it! 💝' : 'Your surprise has been updated successfully. 💝'
        );
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        showModal('error', 'Save Failed', `Error saving surprise: ${saveData.error}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      showModal('error', 'Error', `Something went wrong: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💝</div>
          <p className="font-sans text-deep-rose/60">Loading surprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-deep-rose hover:underline font-sans text-sm mb-4"
          >
            ← Back to Admin
          </button>
          <h1 className="font-serif text-4xl text-deep-rose">
            {isNew ? 'Create New Surprise' : 'Edit Surprise'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-deep-rose/10">
            <h2 className="font-serif text-2xl text-deep-rose mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Surprise Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Day 1: A Letter"
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Unlock Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.unlockDate}
                    onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Unlock Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.unlockTime}
                    onChange={(e) => setFormData({ ...formData, unlockTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Content Type *
                </label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                >
                  <option value="letter">💌 Love Letter</option>
                  <option value="photo">📸 Photo</option>
                  <option value="video">🎥 Video</option>
                  <option value="voice_note">🎤 Voice Note</option>
                  <option value="quiz">❓ Quiz</option>
                  <option value="playlist">🎵 Playlist</option>
                  <option value="mixed">🎁 Mixed Content</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Locked Hint (shown before unlock)
                </label>
                <input
                  type="text"
                  value={formData.lockedHint}
                  onChange={(e) => setFormData({ ...formData, lockedHint: e.target.value })}
                  placeholder="e.g., Something special awaits..."
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Content Based on Type */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-deep-rose/10">
            <h2 className="font-serif text-2xl text-deep-rose mb-6">Content</h2>

            {/* Letter */}
            {formData.contentType === 'letter' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Letter Text *
                  </label>
                  <textarea
                    required
                    value={formData.letterText}
                    onChange={(e) => setFormData({ ...formData, letterText: e.target.value })}
                    placeholder="Write your heartfelt message here..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans resize-none"
                  />
                  <p className="text-xs text-deep-rose/40 mt-2">
                    Tip: Use double line breaks for paragraphs. Text will appear with typewriter effect.
                  </p>
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Signature
                  </label>
                  <input
                    type="text"
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    placeholder="e.g., Your person ♥"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Photo */}
            {formData.contentType === 'photo' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Upload Photos *
                  </label>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-8 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('photos', e)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="font-sans text-deep-rose">Click to upload photos</p>
                      <p className="font-sans text-xs text-deep-rose/40 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Photo Previews */}
                {previews.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previews.photos.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('photos', index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Photo Caption
                  </label>
                  <input
                    type="text"
                    value={formData.photoCaption}
                    onChange={(e) => setFormData({ ...formData, photoCaption: e.target.value })}
                    placeholder="e.g., Remember this day?"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Video */}
            {formData.contentType === 'video' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Upload Video *
                  </label>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-8 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange('videos', e)}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">🎥</div>
                      <p className="font-sans text-deep-rose">Click to upload video</p>
                      <p className="font-sans text-xs text-deep-rose/40 mt-1">
                        MP4, MOV up to 100MB
                      </p>
                    </label>
                  </div>
                </div>

                {previews.videos.length > 0 && (
                  <div className="space-y-2">
                    {files.videos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-deep-rose/5 rounded-lg">
                        <span className="font-sans text-sm text-deep-rose">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('videos', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Video Caption
                  </label>
                  <input
                    type="text"
                    value={formData.videoCaption}
                    onChange={(e) => setFormData({ ...formData, videoCaption: e.target.value })}
                    placeholder="Optional caption"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Voice Note */}
            {formData.contentType === 'voice_note' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Upload Audio *
                  </label>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-8 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange('audio', e)}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">🎤</div>
                      <p className="font-sans text-deep-rose">Click to upload audio</p>
                      <p className="font-sans text-xs text-deep-rose/40 mt-1">
                        MP3, WAV, M4A up to 50MB
                      </p>
                    </label>
                  </div>
                </div>

                {files.audio.length > 0 && (
                  <div className="space-y-2">
                    {files.audio.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-deep-rose/5 rounded-lg">
                        <span className="font-sans text-sm text-deep-rose">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('audio', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quiz */}
            {formData.contentType === 'quiz' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Quiz Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.quizQuestion}
                    onChange={(e) => setFormData({ ...formData, quizQuestion: e.target.value })}
                    placeholder="e.g., Where did we first meet?"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.quizAnswer}
                    onChange={(e) => setFormData({ ...formData, quizAnswer: e.target.value })}
                    placeholder="The answer"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Hint (if they get it wrong)
                  </label>
                  <input
                    type="text"
                    value={formData.quizHint}
                    onChange={(e) => setFormData({ ...formData, quizHint: e.target.value })}
                    placeholder="A helpful hint"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Playlist */}
            {formData.contentType === 'playlist' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Playlist Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.playlistTitle}
                    onChange={(e) => setFormData({ ...formData, playlistTitle: e.target.value })}
                    placeholder="e.g., Songs that remind me of you"
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                    Spotify/YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.playlistUrl}
                    onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                    placeholder="https://open.spotify.com/playlist/..."
                    className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Mixed Content */}
            {formData.contentType === 'mixed' && (
              <div className="space-y-6">
                <p className="font-sans text-sm text-deep-rose/60 italic">
                  Mix and match! Add a letter, photos, videos, audio, quiz, and playlist all in one surprise.
                </p>

                {/* Letter Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <h3 className="font-serif text-lg text-deep-rose">Letter (Optional)</h3>
                  <div>
                    <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                      Letter Text
                    </label>
                    <textarea
                      value={formData.letterText}
                      onChange={(e) => setFormData({ ...formData, letterText: e.target.value })}
                      placeholder="Write your heartfelt message here..."
                      rows={8}
                      className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans resize-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                      Signature
                    </label>
                    <input
                      type="text"
                      value={formData.signature}
                      onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                      placeholder="e.g., Your person ♥"
                      className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Photos Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <h3 className="font-serif text-lg text-deep-rose">Photos (Optional)</h3>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-6 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('photos', e)}
                      className="hidden"
                      id="mixed-photo-upload"
                    />
                    <label htmlFor="mixed-photo-upload" className="cursor-pointer">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="font-sans text-sm text-deep-rose">Add photos</p>
                    </label>
                  </div>
                  {previews.photos.length > 0 && (
                    <div className="space-y-4">
                      {previews.photos.map((preview, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-deep-rose/10">
                          <div className="flex gap-4">
                            <div className="relative group flex-shrink-0">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile('photos', index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                            <div className="flex-1">
                              <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                                Caption for this photo
                              </label>
                              <input
                                type="text"
                                value={mediaCaptions.photos[index] || ''}
                                onChange={(e) => updateCaption('photos', index, e.target.value)}
                                placeholder="e.g., This moment with you..."
                                className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                                readOnly={false}
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <h3 className="font-serif text-lg text-deep-rose">Videos (Optional)</h3>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-6 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange('videos', e)}
                      className="hidden"
                      id="mixed-video-upload"
                    />
                    <label htmlFor="mixed-video-upload" className="cursor-pointer">
                      <div className="text-3xl mb-2">🎥</div>
                      <p className="font-sans text-sm text-deep-rose">Add video</p>
                    </label>
                  </div>
                  {previews.videos.length > 0 && (
                    <div className="space-y-4">
                      {previews.videos.map((preview, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-deep-rose/10">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <span className="font-sans text-sm text-deep-rose font-medium block mb-2">
                                  {files.videos[index]?.name || 'Uploaded Video'}
                                </span>
                                <video
                                  src={preview}
                                  controls
                                  className="w-full max-w-xs h-32 object-cover rounded-lg bg-black"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile('videos', index)}
                                className="text-red-500 text-sm hover:text-red-700 ml-4"
                              >
                                Remove
                              </button>
                            </div>
                            <div>
                              <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                                Caption for this video
                              </label>
                              <input
                                type="text"
                                value={mediaCaptions.videos[index] || ''}
                                onChange={(e) => updateCaption('videos', index, e.target.value)}
                                placeholder="e.g., A moment captured in time..."
                                className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                                readOnly={false}
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audio Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <h3 className="font-serif text-lg text-deep-rose">Audio (Optional)</h3>
                  <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-6 text-center hover:border-deep-rose/40 transition-colors">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange('audio', e)}
                      className="hidden"
                      id="mixed-audio-upload"
                    />
                    <label htmlFor="mixed-audio-upload" className="cursor-pointer">
                      <div className="text-3xl mb-2">🎤</div>
                      <p className="font-sans text-sm text-deep-rose">Add audio</p>
                    </label>
                  </div>
                  {files.audio.length > 0 && (
                    <div className="space-y-4">
                      {files.audio.map((file, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-deep-rose/10">
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-sans text-sm text-deep-rose truncate flex-1">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile('audio', index)}
                              className="text-red-500 text-sm hover:text-red-700 ml-2"
                            >
                              Remove
                            </button>
                          </div>
                          <div>
                            <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                              Caption for this audio
                            </label>
                            <input
                              type="text"
                              value={mediaCaptions.audio[index] || ''}
                              onChange={(e) => updateCaption('audio', index, e.target.value)}
                              placeholder="e.g., Listen to my heart..."
                              className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                              readOnly={false}
                              disabled={false}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quiz Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-lg text-deep-rose">Quiz Questions (Optional)</h3>
                      <p className="font-sans text-xs text-deep-rose/60 italic">
                        Add fun quiz questions for her to answer!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addQuizQuestion}
                      className="px-4 py-2 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm"
                    >
                      + Add Question
                    </button>
                  </div>

                  {quizQuestions.length > 0 && (
                    <div className="space-y-4">
                      {quizQuestions.map((quiz, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-deep-rose/10">
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-sans text-sm text-deep-rose font-medium">Question {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeQuizQuestion(index)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                                Question
                              </label>
                              <input
                                type="text"
                                value={quiz.question}
                                onChange={(e) => updateQuizQuestion(index, 'question', e.target.value)}
                                placeholder="e.g., Where did we first meet?"
                                className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                                Correct Answer
                              </label>
                              <input
                                type="text"
                                value={quiz.answer}
                                onChange={(e) => updateQuizQuestion(index, 'answer', e.target.value)}
                                placeholder="The answer"
                                className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-sans text-xs text-deep-rose/60 mb-2">
                                Hint (if she gets it wrong)
                              </label>
                              <input
                                type="text"
                                value={quiz.hint}
                                onChange={(e) => updateQuizQuestion(index, 'hint', e.target.value)}
                                placeholder="A helpful hint"
                                className="w-full px-3 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-sm bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {quizQuestions.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-deep-rose/20 rounded-lg">
                      <p className="font-sans text-sm text-deep-rose/40">No quiz questions yet. Click "Add Question" to start!</p>
                    </div>
                  )}
                </div>

                {/* Playlist Section */}
                <div className="space-y-4 p-6 bg-deep-rose/5 rounded-lg">
                  <h3 className="font-serif text-lg text-deep-rose">Playlist (Optional)</h3>
                  <p className="font-sans text-xs text-deep-rose/60 italic mb-4">
                    Share a special playlist with her!
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                        Playlist Title
                      </label>
                      <input
                        type="text"
                        value={formData.playlistTitle}
                        onChange={(e) => setFormData({ ...formData, playlistTitle: e.target.value })}
                        placeholder="e.g., Songs that remind me of you"
                        className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                        Spotify/YouTube URL
                      </label>
                      <input
                        type="url"
                        value={formData.playlistUrl}
                        onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                        placeholder="https://open.spotify.com/playlist/..."
                        className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LIVE PREVIEW */}
          {(formData.letterText || 
            previews.photos.length > 0 || 
            previews.videos.length > 0 || 
            previews.audio.length > 0 || 
            formData.quizQuestion ||
            formData.playlistUrl) && (
            <div className="bg-gradient-to-br from-deep-rose/5 to-warm-gold/5 p-8 rounded-xl border-2 border-deep-rose/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-deep-rose">Live Preview</h2>
                <span className="font-sans text-xs text-deep-rose/60 bg-white px-3 py-1 rounded-full">
                  How she'll see it
                </span>
              </div>

              <div className="bg-gradient-to-br from-cream via-soft-rose/20 to-warm-gold/30 p-8 rounded-lg">
                <div className="max-w-2xl mx-auto">
                  {/* Letter Preview */}
                  {formData.contentType === 'letter' && formData.letterText && (
                    <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                      <h2 className="font-script text-4xl text-deep-rose mb-8">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="font-serif text-xl text-deep-rose/90 leading-relaxed whitespace-pre-wrap">
                        {formData.letterText}
                      </div>

                      {formData.signature && (
                        <p className="font-script text-2xl text-deep-rose/70 text-right mt-8">
                          {formData.signature}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Photo Preview */}
                  {formData.contentType === 'photo' && previews.photos.length > 0 && (
                    <div className="space-y-8">
                      <h2 className="font-script text-4xl text-deep-rose text-center">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="bg-white p-6 pb-20 shadow-2xl mx-auto max-w-md">
                        <img
                          src={previews.photos[0]}
                          alt="Preview"
                          className="w-full aspect-square object-cover"
                        />
                        {formData.photoCaption && (
                          <p className="mt-6 font-sans text-deep-rose text-center">
                            {formData.photoCaption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {formData.contentType === 'video' && previews.videos.length > 0 && (
                    <div className="space-y-8">
                      <h2 className="font-script text-4xl text-deep-rose text-center">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="bg-white/90 p-6 rounded-lg shadow-2xl">
                        <video
                          src={previews.videos[0]}
                          controls
                          className="w-full aspect-video rounded-lg bg-black"
                        />
                        {formData.videoCaption && (
                          <p className="mt-4 font-sans text-deep-rose text-center">
                            {formData.videoCaption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Voice Note Preview */}
                  {formData.contentType === 'voice_note' && previews.audio.length > 0 && (
                    <div className="space-y-8">
                      <h2 className="font-script text-4xl text-deep-rose text-center">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="bg-white/90 p-8 rounded-lg shadow-2xl text-center">
                        <div className="text-6xl mb-4">🎤</div>
                        <p className="font-sans text-deep-rose mb-4">Voice Note</p>
                        <p className="font-sans text-sm text-deep-rose/60">{files.audio[0]?.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Mixed Content Preview */}
                  {formData.contentType === 'mixed' && (
                    <div className="space-y-8">
                      <h2 className="font-script text-4xl text-deep-rose text-center mb-8">
                        {formData.title || 'Your Title Here'}
                      </h2>

                      {/* Letter part */}
                      {formData.letterText && (
                        <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                          <div className="font-serif text-xl text-deep-rose/90 leading-relaxed whitespace-pre-wrap">
                            {formData.letterText}
                          </div>
                          {formData.signature && (
                            <p className="font-script text-2xl text-deep-rose/70 text-right mt-8">
                              {formData.signature}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Photos part */}
                      {previews.photos.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {previews.photos.map((photo, index) => (
                            <div key={index} className="bg-white p-4 pb-16 shadow-xl">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full aspect-square object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Video part */}
                      {previews.videos.length > 0 && (
                        <div className="bg-white/90 p-6 rounded-lg shadow-2xl">
                          <video
                            src={previews.videos[0]}
                            controls
                            className="w-full aspect-video rounded-lg bg-black"
                          />
                          {mediaCaptions.videos[0] && (
                            <p className="mt-4 font-handwritten text-lg text-deep-rose/80 text-center">
                              {mediaCaptions.videos[0]}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Audio part */}
                      {previews.audio.length > 0 && (
                        <div className="bg-white/90 p-6 rounded-lg shadow-2xl text-center">
                          <div className="text-4xl mb-2">🎤</div>
                          <p className="font-sans text-sm text-deep-rose/60">{files.audio[0]?.name}</p>
                        </div>
                      )}

                      {/* Quiz part */}
                      {quizQuestions.length > 0 && (
                        <div className="space-y-6">
                          {quizQuestions.map((quiz, index) => (
                            <div key={index} className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                              <div className="space-y-6">
                                <div className="text-center mb-4">
                                  <span className="text-3xl">❓</span>
                                  <p className="font-sans text-sm text-deep-rose/60 mt-2">Question {index + 1}</p>
                                </div>
                                
                                <p className="font-serif text-2xl text-deep-rose text-center">
                                  {quiz.question}
                                </p>
                                
                                <div className="flex justify-center">
                                  <input
                                    type="text"
                                    placeholder="Her answer here..."
                                    className="px-6 py-3 rounded-lg border-2 border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-center"
                                    disabled
                                  />
                                </div>

                                {quiz.answer && (
                                  <p className="font-sans text-sm text-deep-rose/60 text-center italic">
                                    Correct answer: {quiz.answer}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Playlist part */}
                      {formData.playlistUrl && (
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-deep-rose/10">
                          <div className="text-center space-y-4">
                            <div className="text-6xl">🎵</div>
                            <h3 className="font-serif text-2xl text-deep-rose">
                              {formData.playlistTitle || 'Playlist'}
                            </h3>
                            <a
                              href={formData.playlistUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-6 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
                            >
                              Listen Now
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz Preview */}
                  {formData.contentType === 'quiz' && formData.quizQuestion && (
                    <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-2xl border border-deep-rose/10">
                      <h2 className="font-script text-4xl text-deep-rose mb-8 text-center">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="space-y-6">
                        <p className="font-serif text-2xl text-deep-rose text-center">
                          {formData.quizQuestion}
                        </p>
                        
                        <div className="flex justify-center">
                          <input
                            type="text"
                            placeholder="Her answer here..."
                            className="px-6 py-3 rounded-lg border-2 border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans text-center"
                            disabled
                          />
                        </div>

                        <p className="font-sans text-sm text-deep-rose/60 text-center italic">
                          Correct answer: {formData.quizAnswer}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Playlist Preview */}
                  {formData.contentType === 'playlist' && formData.playlistUrl && (
                    <div className="space-y-8">
                      <h2 className="font-script text-4xl text-deep-rose text-center">
                        {formData.title || 'Your Title Here'}
                      </h2>
                      
                      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-deep-rose/10">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">🎵</div>
                          <h3 className="font-serif text-2xl text-deep-rose">
                            {formData.playlistTitle || 'Playlist Title'}
                          </h3>
                          <a
                            href={formData.playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
                          >
                            Listen Now
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-deep-rose/60 mt-4 font-sans">
                ✨ This is exactly how she'll see it (with animations!)
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploadProgress.isUploading}
              className="flex-1 px-6 py-4 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadProgress.isUploading ? 'Uploading...' : (isNew ? 'Create Surprise' : 'Save Changes')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              disabled={uploadProgress.isUploading}
              className="px-6 py-4 bg-white/80 text-deep-rose rounded-lg hover:bg-white transition-colors font-sans border border-deep-rose/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Upload Progress Modal */}
        {uploadProgress.isUploading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-pulse">💝</div>
                <h3 className="font-serif text-2xl text-deep-rose mb-2">Uploading Your Surprise</h3>
                <p className="font-sans text-sm text-deep-rose/60">
                  {uploadProgress.currentFile}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm font-sans text-deep-rose/60 mb-2">
                  <span>{uploadProgress.current} of {uploadProgress.total} files</span>
                  <span>{uploadProgress.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-deep-rose/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-deep-rose to-soft-rose"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress.percentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <p className="text-center font-sans text-xs text-deep-rose/40">
                Please don't close this window...
              </p>
            </motion.div>
          </div>
        )}

        {/* Success/Error Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="text-6xl mb-4">
                  {modal.type === 'success' && '✨'}
                  {modal.type === 'error' && '😔'}
                  {modal.type === 'info' && '💭'}
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-deep-rose mb-3">
                  {modal.title}
                </h3>

                {/* Message */}
                <p className="font-sans text-deep-rose/70 mb-6">
                  {modal.message}
                </p>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans shadow-lg"
                >
                  {modal.type === 'success' ? 'Awesome!' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
