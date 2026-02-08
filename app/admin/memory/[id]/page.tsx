'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditMemoryPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState({
    date: '',
    caption: '',
    rotation: 0,
    position: 'center',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  // Modal state
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setModal({ show: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoFile) {
      showModal('error', 'Missing Photo', 'Please upload a photo for this memory.');
      return;
    }
    
    setUploading(true);
    
    try {
      // Step 1: Upload photo to Cloudinary
      setUploadProgress('Uploading photo to Cloudinary...');
      let photoUrl = '';
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', photoFile);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('Upload failed with status:', uploadRes.status, errorText);
        showModal('error', 'Upload Failed', `Server returned ${uploadRes.status}: ${errorText}`);
        setUploading(false);
        return;
      }
      
      const uploadData = await uploadRes.json();
      console.log('Upload response:', uploadData);
      console.log('Upload response keys:', Object.keys(uploadData));
      console.log('Upload success value:', uploadData.success);
      console.log('Upload URL value:', uploadData.url);
      
      if (!uploadData.success && !uploadData.url) {
        showModal('error', 'Upload Failed', uploadData.error || 'Failed to upload photo to Cloudinary');
        setUploading(false);
        return;
      }
      
      photoUrl = uploadData.url;
      console.log('Photo uploaded successfully:', photoUrl);
      
      // Step 2: Get the next order_index
      setUploadProgress('Preparing memory data...');
      const memoriesRes = await fetch('/api/memories');
      const memoriesData = await memoriesRes.json();
      const nextOrderIndex = memoriesData.data ? memoriesData.data.length + 1 : 1;
      
      // Step 3: Save to Supabase
      setUploadProgress('Saving memory to database...');
      const memoryData = {
        date: formData.date,
        photo_url: photoUrl,
        caption: formData.caption,
        rotation: formData.rotation,
        position: formData.position,
        order_index: nextOrderIndex,
      };
      
      console.log('Saving memory data:', memoryData);
      
      const saveRes = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData),
      });
      
      const saveData = await saveRes.json();
      console.log('Save response:', saveData);
      
      if (saveData.success) {
        showModal('success', 'Memory Saved! ✨', 'Your memory has been added successfully!');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        showModal('error', 'Save Failed', saveData.error || 'Failed to save memory to database');
      }
    } catch (error: any) {
      console.error('Error:', error);
      showModal('error', 'Unexpected Error', error.message || 'Something went wrong');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-deep-rose hover:underline font-sans text-sm mb-4"
          >
            ← Back to Admin
          </button>
          <h1 className="font-serif text-4xl text-deep-rose">
            {isNew ? 'Add New Memory' : 'Edit Memory'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-deep-rose/10">
            <h2 className="font-serif text-2xl text-deep-rose mb-6">Photo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Upload Photo *
                </label>
                <div className="border-2 border-dashed border-deep-rose/20 rounded-lg p-8 text-center hover:border-deep-rose/40 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="memory-photo-upload"
                    required={isNew}
                  />
                  <label htmlFor="memory-photo-upload" className="cursor-pointer">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-w-full h-64 object-contain mx-auto rounded-lg"
                        />
                        <p className="font-sans text-xs text-deep-rose/60 mt-2">
                          Click to change photo
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📸</div>
                        <p className="font-sans text-deep-rose">Click to upload photo</p>
                        <p className="font-sans text-xs text-deep-rose/40 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Memory Details */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-deep-rose/10">
            <h2 className="font-serif text-2xl text-deep-rose mb-6">Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Date/Time Period *
                </label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., January 2023, Summer 2022, Our first date"
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Caption *
                </label>
                <textarea
                  required
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Write a short, personal caption about this memory..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans resize-none"
                />
                <p className="text-xs text-deep-rose/40 mt-2">
                  Tip: Make it specific and personal. Inside jokes work great!
                </p>
              </div>

              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Photo Rotation (for scrapbook effect)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={formData.rotation}
                    onChange={(e) => setFormData({ ...formData, rotation: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="font-sans text-sm text-deep-rose w-16 text-right">
                    {formData.rotation}°
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm text-deep-rose/60 mb-2">
                  Position on Page
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          {photoPreview && (
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-deep-rose/10">
              <h2 className="font-serif text-2xl text-deep-rose mb-6">Preview</h2>
              
              <div className={`flex justify-${formData.position}`}>
                <div
                  className="bg-white p-4 pb-16 shadow-2xl max-w-md"
                  style={{ transform: `rotate(${formData.rotation}deg)` }}
                >
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="mt-4 space-y-2">
                    <p className="font-script text-sm text-deep-rose/60">{formData.date || 'Date'}</p>
                    <p className="font-sans text-deep-rose">
                      {formData.caption || 'Your caption will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-4 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? uploadProgress : (isNew ? 'Add Memory' : 'Save Changes')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              disabled={uploading}
              className="px-6 py-4 bg-white/80 text-deep-rose rounded-lg hover:bg-white transition-colors font-sans border border-deep-rose/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {modal.type === 'success' && '✨'}
                {modal.type === 'error' && '😔'}
                {modal.type === 'info' && '💭'}
              </div>
              <h3 className="font-serif text-2xl text-deep-rose">
                {modal.title}
              </h3>
              <p className="font-sans text-deep-rose/70">
                {modal.message}
              </p>
              <button
                onClick={closeModal}
                className="mt-6 px-8 py-3 bg-deep-rose text-white rounded-full hover:bg-deep-rose/90 transition-colors font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
