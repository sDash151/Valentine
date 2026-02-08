'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'surprises' | 'memories' | 'settings'>('surprises');
  const [surprises, setSurprises] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    her_nickname: '',
    your_signature: '',
    site_password: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Load data from Supabase
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

      // Load memories
      const memoriesRes = await fetch('/api/memories');
      const memoriesData = await memoriesRes.json();
      if (memoriesData.success) {
        setMemories(memoriesData.data || []);
      }

      // Load settings
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setSettings({
          her_nickname: settingsData.data.her_nickname || '',
          your_signature: settingsData.data.your_signature || '',
          site_password: settingsData.data.site_password || '',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Settings saved successfully!');
      } else {
        alert('❌ Error saving settings: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-rose/10 to-warm-gold/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-deep-rose/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl text-deep-rose">Admin Panel</h1>
              <p className="font-sans text-sm text-deep-rose/60">Manage your Valentine Week content</p>
            </div>
            <Link href="/home">
              <button className="px-4 py-2 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm">
                View Site →
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8">
          {[
            { id: 'surprises', label: 'Surprises', icon: '🎁' },
            { id: 'memories', label: 'Memory Lane', icon: '📸' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-6 py-3 rounded-lg font-sans text-sm transition-all
                ${activeTab === tab.id
                  ? 'bg-deep-rose text-white shadow-lg'
                  : 'bg-white/80 text-deep-rose hover:bg-white'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Surprises Tab */}
        {activeTab === 'surprises' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add New Button */}
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl text-deep-rose">All Surprises</h2>
              <Link href="/admin/surprise/new">
                <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm shadow-lg">
                  + Add New Surprise
                </button>
              </Link>
            </div>

            {/* Surprises List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="font-sans text-deep-rose/60">Loading surprises...</p>
              </div>
            ) : surprises.length === 0 ? (
              <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-deep-rose/10">
                <p className="font-sans text-deep-rose/60 mb-4">No surprises yet. Create your first one!</p>
                <Link href="/admin/surprise/new">
                  <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm">
                    + Add First Surprise
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {surprises.map((surprise) => (
                  <div
                    key={surprise.id}
                    className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-deep-rose/10 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-xl text-deep-rose">{surprise.title}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-sans bg-green-100 text-green-700">
                            published
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-deep-rose/60 font-sans">
                          <span>📅 {new Date(surprise.unlock_date).toLocaleDateString()}</span>
                          <span>📝 {surprise.content_type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/surprise/${surprise.id}`}>
                          <button className="px-4 py-2 bg-deep-rose/10 text-deep-rose rounded-lg hover:bg-deep-rose/20 transition-colors font-sans text-sm">
                            Edit
                          </button>
                        </Link>
                        <Link href={`/surprise/${surprise.id}`} target="_blank">
                          <button className="px-4 py-2 bg-warm-gold/20 text-deep-rose rounded-lg hover:bg-warm-gold/30 transition-colors font-sans text-sm">
                            Preview
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl text-deep-rose">Memory Lane Content</h2>
              <Link href="/admin/memory/new">
                <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm shadow-lg">
                  + Add New Memory
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="font-sans text-deep-rose/60">Loading memories...</p>
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-deep-rose/10">
                <p className="font-sans text-deep-rose/60 mb-4">No memories yet. Add your first one!</p>
                <Link href="/admin/memory/new">
                  <button className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm">
                    + Add First Memory
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-deep-rose/10 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-soft-rose/20 to-deep-rose/20 rounded-lg flex items-center justify-center">
                        {memory.photo_url ? '📷' : '➕'}
                      </div>
                      <div className="flex-1">
                        <p className="font-script text-sm text-deep-rose/60 mb-1">{memory.date}</p>
                        <p className="font-sans text-deep-rose mb-3">{memory.caption}</p>
                        <Link href={`/admin/memory/${memory.id}`}>
                          <button className="text-sm text-deep-rose hover:underline font-sans">
                            Edit →
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-deep-rose">Settings</h2>
            
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-deep-rose/10">
              <h3 className="font-serif text-xl text-deep-rose mb-4">Personalization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">Her Nickname</label>
                  <input
                    type="text"
                    value={settings.her_nickname}
                    onChange={(e) => setSettings({ ...settings, her_nickname: e.target.value })}
                    placeholder="Enter her nickname"
                    className="w-full px-4 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                  <p className="text-xs text-deep-rose/40 mt-1">
                    This will be used in greetings throughout the site
                  </p>
                </div>
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">Your Name/Signature</label>
                  <input
                    type="text"
                    value={settings.your_signature}
                    onChange={(e) => setSettings({ ...settings, your_signature: e.target.value })}
                    placeholder="How you want to sign messages"
                    className="w-full px-4 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                  <p className="text-xs text-deep-rose/40 mt-1">
                    This will appear at the end of letters and messages
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-deep-rose/10">
              <h3 className="font-serif text-xl text-deep-rose mb-4">Access Control</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-sans text-sm text-deep-rose/60 mb-2">Site Password</label>
                  <input
                    type="text"
                    value={settings.site_password}
                    onChange={(e) => setSettings({ ...settings, site_password: e.target.value })}
                    placeholder="Set a password for her to access"
                    className="w-full px-4 py-2 rounded-lg border border-deep-rose/20 focus:border-deep-rose focus:outline-none font-sans"
                  />
                  <p className="text-xs text-deep-rose/40 mt-1">
                    She'll need this password to access the site
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-6 py-3 bg-deep-rose text-white rounded-lg hover:bg-deep-rose/90 transition-colors font-sans text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
