import React, { useState } from 'react';
import {
  Heart,
  Trash2,
  Share2,
  Info,
  ChevronLeft,
  Search,
  Cloud,
  Check,
  RefreshCw,
  Image as ImageIcon,
  FolderPlus,
  Mail,
  Smartphone,
  Sparkles,
  Download,
  Palette
} from 'lucide-react';
import { SimulatorState, UserPhotoItem } from '../../../types';
import { WallpaperBackground } from '../WallpaperBackground';
import { playVolumeStepSound } from '../../../utils/audioUtils';

interface PhotosAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose?: () => void;
}

export const PhotosApp: React.FC<PhotosAppProps> = ({ state, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'albums' | 'search' | 'gmail_sync'>('library');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [gmailSyncModalOpen, setGmailSyncModalOpen] = useState(false);
  const [customGmailInput, setCustomGmailInput] = useState(state.gmailSync.email);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);

  const selectedPhoto = state.userPhotos.find((p) => p.id === selectedPhotoId);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdateState((s) => ({
      ...s,
      userPhotos: s.userPhotos.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    }));
  };

  const deletePhoto = (id: string) => {
    onUpdateState((s) => ({
      ...s,
      userPhotos: s.userPhotos.filter((p) => p.id !== id)
    }));
    setSelectedPhotoId(null);
  };

  const handleSyncWithGmail = () => {
    setSyncProgress(10);
    onUpdateState((s) => ({
      ...s,
      gmailSync: { ...s.gmailSync, isSyncing: true }
    }));

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          onUpdateState((s) => ({
            ...s,
            gmailSync: {
              ...s.gmailSync,
              isSyncing: false,
              lastSynced: 'Just now',
              backupPhotosCount: s.userPhotos.length
            }
          }));
          return null;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSaveGmailAccount = () => {
    onUpdateState((s) => ({
      ...s,
      gmailSync: {
        ...s.gmailSync,
        email: customGmailInput.trim() || 'vishnusairamiya20@gmail.com',
        connected: true
      }
    }));
    setGmailSyncModalOpen(false);
    handleSyncWithGmail();
  };

  const filteredPhotos = state.userPhotos.filter((p) => {
    if (!searchQuery) return true;
    return p.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans relative`}>
      {/* Gmail Cloud Sync Config Modal */}
      {gmailSyncModalOpen && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 p-4 pt-14 flex flex-col justify-center animate-fade-in">
          <div className={`rounded-3xl p-5 space-y-4 shadow-2xl ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <Mail className="w-5 h-5" />
              <span>Google Account / Gmail Cloud Sync</span>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sync your iPhone photos, camera roll, and live snapshots directly with your primary Google Photos & Gmail cloud backup.
            </p>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase font-semibold">Primary Gmail Address</label>
              <input
                type="email"
                value={customGmailInput}
                onChange={(e) => setCustomGmailInput(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs font-mono outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
              <span className="font-semibold">Auto-Backup Camera Roll</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setGmailSyncModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGmailAccount}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save & Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Fullscreen Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 bg-black z-40 flex flex-col justify-between p-3 pt-12 text-white animate-fade-in">
          {/* Top Viewer Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedPhotoId(null);
                setShowShareSheet(false);
                setShowInfoSheet(false);
              }}
              className="flex items-center gap-1 text-blue-400 font-medium text-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <span className="text-xs text-neutral-400">{selectedPhoto.date}</span>
            <button
              onClick={(e) => toggleFavorite(selectedPhoto.id, e)}
              className="p-1 text-amber-400 cursor-pointer"
            >
              <Heart className="w-5 h-5" fill={selectedPhoto.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Photo Display Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            {selectedPhoto.url ? (
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[380px] max-w-full rounded-2xl object-contain shadow-2xl border border-neutral-800"
              />
            ) : (
              <div className="w-64 h-64 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex flex-col items-center justify-center text-7xl shadow-2xl">
                <span>{selectedPhoto.emoji || '📸'}</span>
                <span className="text-xs text-white/90 font-medium mt-3">{selectedPhoto.title}</span>
              </div>
            )}
          </div>

          {/* Share Sheet Overlay */}
          {showShareSheet && (
            <div className="p-3 bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-800 space-y-2 text-xs mb-2 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                <span className="font-bold text-xs">Share Photo</span>
                <button onClick={() => setShowShareSheet(false)} className="text-neutral-400 text-xs">✕</button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div
                  onClick={() => {
                    onUpdateState((s) => ({ ...s, currentApp: 'messages' }));
                    setShowShareSheet(false);
                    setSelectedPhotoId(null);
                  }}
                  className="p-2 rounded-xl bg-green-500/20 text-green-400 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span>💬</span>
                  <span>Messages</span>
                </div>
                <div
                  onClick={() => {
                    handleSyncWithGmail();
                    setShowShareSheet(false);
                  }}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>Gmail</span>
                </div>
                <div
                  onClick={() => {
                    let targetWallpaper = 'beach';
                    if (selectedPhoto.id === 'p-f1' || selectedPhoto.id.includes('f1')) targetWallpaper = 'f1';
                    else if (selectedPhoto.id === 'p-beach-sunset') targetWallpaper = 'beach_sunset';
                    else if (selectedPhoto.id === 'p-beach-tropical' || selectedPhoto.id === 'p4') targetWallpaper = 'beach_tropical';
                    else if (selectedPhoto.id === 'p-ironman') targetWallpaper = 'ironman';
                    else if (selectedPhoto.id === 'p-ironman-suit') targetWallpaper = 'ironman_suit';
                    else if (selectedPhoto.id === 'p8') targetWallpaper = 'astronomy';
                    
                    onUpdateState((s) => ({ ...s, wallpaper: targetWallpaper }));
                    playVolumeStepSound();
                    setShowShareSheet(false);
                  }}
                  className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>Set Wallpaper</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300 flex flex-col items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>Save Files</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Sheet Overlay */}
          {showInfoSheet && (
            <div className="p-3 bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-neutral-800 space-y-1 text-xs mb-2 animate-fade-in">
              <p className="font-bold text-sm text-white">{selectedPhoto.title}</p>
              <p className="text-[11px] text-neutral-400">Resolution: 1179 × 2556 • Ultra High Definition 4K</p>
              <p className="text-[11px] text-neutral-400">
                Status:{' '}
                {(state.wallpaper === 'f1' && (selectedPhoto.id === 'p-f1' || selectedPhoto.id.includes('f1'))) ||
                (state.wallpaper.includes('beach') && selectedPhoto.id.includes('beach')) ||
                (state.wallpaper.includes('ironman') && selectedPhoto.id.includes('ironman'))
                  ? 'Active Device Wallpaper'
                  : 'Ready to Apply'}
              </p>
            </div>
          )}

          {/* Bottom Viewer Toolbar */}
          <div className="flex items-center justify-around py-2 border-t border-neutral-800 text-neutral-400">
            <button onClick={() => setShowShareSheet(!showShareSheet)} className="p-2 hover:text-white cursor-pointer" title="Share Sheet">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                let targetWallpaper = 'beach';
                if (selectedPhoto.id === 'p-f1' || selectedPhoto.id.includes('f1')) targetWallpaper = 'f1';
                else if (selectedPhoto.id === 'p-beach-sunset') targetWallpaper = 'beach_sunset';
                else if (selectedPhoto.id === 'p-beach-tropical' || selectedPhoto.id === 'p4') targetWallpaper = 'beach_tropical';
                else if (selectedPhoto.id === 'p-ironman') targetWallpaper = 'ironman';
                else if (selectedPhoto.id === 'p-ironman-suit') targetWallpaper = 'ironman_suit';
                else if (selectedPhoto.id === 'p8') targetWallpaper = 'astronomy';

                onUpdateState((s) => ({
                  ...s,
                  wallpaper: targetWallpaper
                }));
                playVolumeStepSound();
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-semibold hover:bg-blue-500/30 cursor-pointer"
              title="Set as Wallpaper"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Use as Wallpaper</span>
            </button>
            <button onClick={() => setShowInfoSheet(!showInfoSheet)} className="p-2 hover:text-white cursor-pointer" title="Photo Info">
              <Info className="w-5 h-5" />
            </button>
            <button onClick={() => deletePhoto(selectedPhoto.id)} className="p-2 hover:text-red-500 cursor-pointer" title="Delete Photo">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-14 pb-2 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold">Photos</h1>
          <p className="text-[10px] text-neutral-400">{state.userPhotos.length} items in Library</p>
        </div>

        {/* Gmail Cloud Sync Pill */}
        <button
          onClick={() => setGmailSyncModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-semibold hover:bg-rose-500/20 transition-colors cursor-pointer"
        >
          <Cloud className="w-3 h-3" />
          <span>Gmail Sync</span>
          {state.gmailSync.isSyncing && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
        </button>
      </div>

      {/* Sync Progress Bar */}
      {syncProgress !== null && (
        <div className="bg-rose-500 text-white text-[10px] px-3 py-1 flex items-center justify-between font-semibold">
          <span>Backing up to {state.gmailSync.email}...</span>
          <span>{syncProgress}%</span>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            {/* Google Sync Info Card */}
            <div
              onClick={() => setGmailSyncModalOpen(true)}
              className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                  G
                </div>
                <div>
                  <p className="font-bold text-xs">Google Photos & Gmail Sync</p>
                  <p className="text-[10px] text-neutral-400">{state.gmailSync.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                {state.gmailSync.isSyncing ? 'Syncing...' : 'Synced'}
              </span>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative group cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  {photo.url ? (
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 flex items-center justify-center text-3xl">
                      <span>{photo.emoji || '📸'}</span>
                    </div>
                  )}

                  {photo.isFavorite && (
                    <div className="absolute top-1.5 right-1.5 text-amber-400 text-[10px] drop-shadow-md">
                      ★
                    </div>
                  )}
                  {photo.isCameraRoll && (
                    <div className="absolute bottom-1 left-1 px-1 rounded-sm bg-black/60 text-[8px] text-white font-mono">
                      RAW
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALBUMS TAB */}
        {activeTab === 'albums' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">My Albums</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Recents', count: state.userPhotos.length, icon: '🖼️' },
                { name: 'Favorites', count: state.userPhotos.filter((p) => p.isFavorite).length, icon: '❤️' },
                { name: 'Gmail Synced', count: state.userPhotos.length, icon: '☁️' },
                { name: 'Camera Roll', count: state.userPhotos.filter((p) => p.isCameraRoll).length, icon: '📸' }
              ].map((album) => (
                <div
                  key={album.name}
                  onClick={() => setActiveTab('library')}
                  className={`p-3.5 rounded-2xl border space-y-2 cursor-pointer hover:opacity-85 ${
                    state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <span className="text-3xl">{album.icon}</span>
                  <div>
                    <p className="font-bold text-xs">{album.name}</p>
                    <p className="text-[10px] text-neutral-400">{album.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'}`}>
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Photos, Places, Dogs, Pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs w-full outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Sunrise', 'Retriever', 'Pizza', 'Beach', 'Cycling', 'Coffee', 'Tokyo'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[11px] font-medium hover:bg-blue-500 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className="aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative cursor-pointer"
                >
                  {photo.url ? (
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 flex items-center justify-center text-3xl">
                      <span>{photo.emoji || '📸'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div className={`pt-2 pb-3 px-4 border-t flex justify-around text-[10px] font-semibold ${
        state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90 text-neutral-400' : 'border-neutral-200 bg-neutral-50/90 text-neutral-500'
      }`}>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'library' ? 'text-blue-500 font-bold' : ''}`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Library</span>
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'albums' ? 'text-blue-500 font-bold' : ''}`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Albums</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'search' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};
