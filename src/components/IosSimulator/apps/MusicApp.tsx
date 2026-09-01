import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Search,
  Radio,
  Library,
  Compass,
  Flame,
  ChevronDown,
  ListMusic,
  Mic2,
  Share2,
  Airplay,
  Sparkles,
  ExternalLink,
  Check,
  Disc3
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import { startMusicSynthesis, stopMusicSynthesis, playVolumeStepSound } from '../../../utils/audioUtils';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverGradient: string;
  genre: 'pop' | 'lofi' | 'synthwave' | 'acoustic' | 'classical';
  durationSec: number;
  youtubeQuery: string;
  lyrics: string[];
}

export const MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours (Deluxe)',
    coverGradient: 'from-red-600 via-rose-600 to-amber-600',
    genre: 'synthwave',
    durationSec: 200,
    youtubeQuery: 'The Weeknd Blinding Lights Official Music Video',
    lyrics: [
      "I've been on my own for long enough",
      "Maybe you can show me how to love, maybe",
      "I'm going through withdrawals",
      "You don't even have to do too much",
      "You can turn me on with just a touch, baby",
      "I look around and Sin City's cold and empty",
      "No one's around to judge me",
      "I can't see clearly when you're gone",
      "I said, ooh, I'm blinded by the lights!"
    ]
  },
  {
    id: 'track-2',
    title: 'Lofi Sunset Glow',
    artist: 'Lofi Girl & Chillhop',
    album: 'Beats to Relax / Study to',
    coverGradient: 'from-amber-400 via-orange-500 to-indigo-700',
    genre: 'lofi',
    durationSec: 180,
    youtubeQuery: 'Lofi Girl relaxing study beats live',
    lyrics: [
      "(Soft vinyl crackle & warm Rhodes piano)",
      "Gentle breeze rolling through the coastal sunset",
      "Lo-fi drums ticking in sync with late-night thoughts",
      "Coding, studying, and relaxing under the evening sky",
      "(Melodic saxophone resonance)",
      "Peaceful harmony floating across the horizon"
    ]
  },
  {
    id: 'track-3',
    title: 'Espresso Summer',
    artist: 'Sabrina Carpenter',
    album: 'Short n\' Sweet',
    coverGradient: 'from-amber-300 via-pink-400 to-rose-500',
    genre: 'pop',
    durationSec: 175,
    youtubeQuery: 'Sabrina Carpenter Espresso Official Music Video',
    lyrics: [
      "Now he's thinkin' 'bout me every night, oh",
      "Is it that sweet? I guess so!",
      "Say you can't sleep, baby, I know",
      "That's that me, espresso!",
      "Move it up, down, left, right, oh",
      "Switch it up like Nintendo",
      "Say you can't sleep, baby, I know",
      "That's that me, espresso!"
    ]
  },
  {
    id: 'track-4',
    title: 'Golden Hour Waves',
    artist: 'JVKE',
    album: 'this is what ____ feels like',
    coverGradient: 'from-amber-200 via-yellow-400 to-orange-500',
    genre: 'acoustic',
    durationSec: 210,
    youtubeQuery: 'JVKE Golden Hour piano official audio',
    lyrics: [
      "It was just two lovers, sittin' in the car",
      "Listening to Blonde, fallin' for each other",
      "Pink and orange skies, feelin' super alive",
      "Your eyes take me on a ride",
      "I'm lookin' at you and your beauty's uncompromised",
      "Glow in the golden hour light..."
    ]
  },
  {
    id: 'track-5',
    title: 'Night City Synth',
    artist: 'Kavinsky & Daft Beats',
    album: 'OutRun Electro Drive',
    coverGradient: 'from-cyan-500 via-blue-600 to-purple-800',
    genre: 'synthwave',
    durationSec: 230,
    youtubeQuery: 'Cyberpunk Synthwave Neon City Drive 4K',
    lyrics: [
      "(Punchy 80s analog bass synthesizer)",
      "Driving through high-speed neon expressways",
      "Laser reflections on the sports car windshield",
      "Rhythm of the future pulsing through the speakers",
      "(Euphoric synth progression drops)",
      "Infinite horizon, unstoppable velocity"
    ]
  },
  {
    id: 'track-6',
    title: 'Moonlight Sonata & Calm Keys',
    artist: 'Ludwig Van & Modern Piano',
    album: 'Classical Horizons',
    coverGradient: 'from-indigo-900 via-purple-900 to-slate-950',
    genre: 'classical',
    durationSec: 240,
    youtubeQuery: 'Moonlight Sonata Beethoven relaxing piano',
    lyrics: [
      "(Serene arpeggiated acoustic grand piano)",
      "Adagio sostenuto in C-sharp minor",
      "Graceful harmonic waves reflecting peaceful moonlight",
      "Timeless classical acoustic resonance",
      "Dynamic cadence softening into gentle twilight"
    ]
  }
];

interface MusicAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp: (app: IosAppId) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({ state, onUpdateState, onOpenApp }) => {
  const [activeTab, setActiveTab] = useState<'listen' | 'browse' | 'radio' | 'library' | 'search'>('listen');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(24);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['track-1', 'track-2']);
  const [playerViewMode, setPlayerViewMode] = useState<'artwork' | 'lyrics'>('artwork');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showAirPlayModal, setShowAirPlayModal] = useState(false);
  const [activeAirplayDevice, setActiveAirplayDevice] = useState('iPhone (Built-in Speaker)');

  const currentTrack = MUSIC_CATALOG[currentTrackIndex] || MUSIC_CATALOG[0];

  // Timer loop when music is playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (state.isPlayingMusic) {
      interval = setInterval(() => {
        setElapsedSec((prev) => {
          if (prev >= currentTrack.durationSec) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isPlayingMusic, currentTrack.durationSec]);

  const handlePlayTrack = (index: number) => {
    playVolumeStepSound();
    setCurrentTrackIndex(index);
    const targetTrack = MUSIC_CATALOG[index];
    setElapsedSec(0);

    onUpdateState((s) => ({
      ...s,
      isPlayingMusic: true,
      currentSong: {
        title: targetTrack.title,
        artist: targetTrack.artist
      },
      dynamicIslandState: 'music'
    }));

    startMusicSynthesis(targetTrack.genre);
  };

  const handleTogglePlayPause = () => {
    playVolumeStepSound();
    if (state.isPlayingMusic) {
      stopMusicSynthesis();
      onUpdateState((s) => ({
        ...s,
        isPlayingMusic: false,
        dynamicIslandState: s.isTimerRunning ? 'timer' : 'idle'
      }));
    } else {
      startMusicSynthesis(currentTrack.genre);
      onUpdateState((s) => ({
        ...s,
        isPlayingMusic: true,
        currentSong: {
          title: currentTrack.title,
          artist: currentTrack.artist
        },
        dynamicIslandState: 'music'
      }));
    }
  };

  const handleNextTrack = () => {
    playVolumeStepSound();
    let nextIdx = (currentTrackIndex + 1) % MUSIC_CATALOG.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * MUSIC_CATALOG.length);
    }
    handlePlayTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    playVolumeStepSound();
    const prevIdx = (currentTrackIndex - 1 + MUSIC_CATALOG.length) % MUSIC_CATALOG.length;
    handlePlayTrack(prevIdx);
  };

  const toggleFavorite = (trackId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playVolumeStepSound();
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleOpenYouTubeVideo = (query: string) => {
    playVolumeStepSound();
    // Open YouTube App directly and carry over context
    onOpenApp('youtube');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const filteredCatalog = MUSIC_CATALOG.filter((t) => {
    if (selectedGenre && t.genre !== selectedGenre) return false;
    if (!searchQuery) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-neutral-900 text-white'} select-none font-sans relative overflow-hidden`}>
      {/* Top Header */}
      <div className="pt-12 pb-2 px-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-600 to-red-500 flex items-center justify-center shadow-md">
            <span className="text-base">🎵</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Apple Music</h1>
            <p className="text-[10px] text-neutral-400">Hi-Res Lossless & Spatial Audio</p>
          </div>
        </div>

        {/* Quick YouTube Music Cross-Link Button */}
        <button
          onClick={() => onOpenApp('youtube')}
          title="Switch to YouTube App"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[11px] font-semibold hover:bg-red-600/30 active:scale-95 transition-all cursor-pointer"
        >
          <span className="text-xs">▶️</span>
          <span>YouTube</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4">
        {/* LISTEN NOW TAB */}
        {activeTab === 'listen' && (
          <div className="space-y-4 animate-fade-in">
            {/* Hero Top Pick Banner */}
            <div
              onClick={() => handlePlayTrack(0)}
              className="rounded-3xl bg-gradient-to-br from-rose-700 via-pink-700 to-indigo-900 p-4 relative overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform border border-white/10"
            >
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-rose-100">
                  Featured Top Hit
                </span>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{MUSIC_CATALOG[0].title}</h2>
                  <p className="text-xs text-rose-100 font-medium">{MUSIC_CATALOG[0].artist}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95">
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Play Now</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenYouTubeVideo(MUSIC_CATALOG[0].youtubeQuery);
                    }}
                    className="px-3 py-1.5 rounded-full bg-black/40 text-white font-medium text-xs flex items-center gap-1 border border-white/20 hover:bg-black/60"
                  >
                    <span>Watch Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <Disc3 className="absolute -right-6 -bottom-6 w-36 h-36 text-white/10 animate-spin-slow pointer-events-none" />
            </div>

            {/* YouTube Music Integration Banner */}
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xl shadow-xs">
                  ▶️
                </div>
                <div>
                  <p className="font-bold text-xs text-white">YouTube App Installed</p>
                  <p className="text-[10px] text-neutral-400">Stream 4K music videos, live sets & shorts</p>
                </div>
              </div>
              <button
                onClick={() => onOpenApp('youtube')}
                className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-500 active:scale-95 cursor-pointer"
              >
                OPEN
              </button>
            </div>

            {/* Recently Played / Recommended Tracks Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Top Stations & Tracks</span>
                </h3>
                <span className="text-[11px] text-rose-400 font-medium cursor-pointer">See All</span>
              </div>

              <div className="space-y-2">
                {MUSIC_CATALOG.map((track, idx) => {
                  const isCurrent = currentTrackIndex === idx;
                  const isPlayingThis = isCurrent && state.isPlayingMusic;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handlePlayTrack(idx)}
                      className={`p-2.5 rounded-2xl flex items-center justify-between border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-rose-950/40 border-rose-500/50 shadow-md'
                          : 'bg-neutral-900/90 border-neutral-800/80 hover:bg-neutral-850'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Cover Art */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${track.coverGradient} flex items-center justify-center text-white shadow-md relative shrink-0 overflow-hidden`}
                        >
                          {isPlayingThis ? (
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-white rounded-full animate-bounce h-4" />
                              <span className="w-1 bg-white rounded-full animate-bounce delay-100 h-3" />
                              <span className="w-1 bg-white rounded-full animate-bounce delay-200 h-4" />
                            </div>
                          ) : (
                            <span className="text-xl">🎵</span>
                          )}
                        </div>

                        {/* Title & Artist */}
                        <div className="min-w-0">
                          <p className={`font-bold text-xs truncate ${isCurrent ? 'text-rose-400' : 'text-white'}`}>
                            {track.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate">{track.artist}</p>
                          <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold">
                            {track.genre} • {formatTime(track.durationSec)}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleFavorite(track.id, e)}
                          className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              likedTrackIds.includes(track.id) ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) {
                              handleTogglePlayPause();
                            } else {
                              handlePlayTrack(idx);
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isPlayingThis
                              ? 'bg-rose-500 text-white'
                              : 'bg-neutral-800 text-white hover:bg-neutral-700'
                          }`}
                        >
                          {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold">Browse Music</h2>
            {/* Genre Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all', 'pop', 'lofi', 'synthwave', 'acoustic', 'classical'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre === 'all' ? null : genre)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    (genre === 'all' && selectedGenre === null) || selectedGenre === genre
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Curated Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {filteredCatalog.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => handlePlayTrack(idx)}
                  className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 cursor-pointer hover:border-rose-500/50 transition-all group"
                >
                  <div className={`aspect-square rounded-xl bg-gradient-to-tr ${t.coverGradient} flex items-center justify-center text-3xl shadow-md relative overflow-hidden`}>
                    <span>🎵</span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-xs truncate text-white">{t.title}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{t.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RADIO TAB */}
        {activeTab === 'radio' && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-bold">Apple Music Radio</h2>

            {/* Apple Music 1 Live Card */}
            <div
              onClick={() => handlePlayTrack(0)}
              className="p-4 rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-800 to-neutral-900 border border-purple-500/30 space-y-3 shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 bg-black/40 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  LIVE
                </span>
                <Radio className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-black">Apple Music 1</h3>
                <p className="text-xs text-purple-200">The world’s top hits, live interviews & DJ sets</p>
              </div>
              <button className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 shadow-md">
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Tune In Live</span>
              </button>
            </div>

            {/* Radio Stations List */}
            <div className="space-y-2">
              {[
                { name: 'Chillout Beach Lounge', desc: 'Warm acoustic guitars & relaxing ocean melodies', icon: '🏖️' },
                { name: 'Lo-Fi Coding Beats', desc: 'Focus beats without lyrics for developers', icon: '💻' },
                { name: '80s Synth Retro Wave', desc: 'Fast-paced neon electronic retro tracks', icon: '⚡' }
              ].map((st, i) => (
                <div
                  key={st.name}
                  onClick={() => handlePlayTrack(i + 1)}
                  className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center text-2xl">
                      {st.icon}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{st.name}</p>
                      <p className="text-[10px] text-neutral-400">{st.desc}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-bold">Your Library</h2>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Playlists', count: '6 playlists', icon: '📑' },
                { name: 'Artists', count: '14 artists', icon: '🎤' },
                { name: 'Albums', count: '12 albums', icon: '💿' },
                { name: 'Downloaded', count: 'All available offline', icon: '⬇️' }
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-bold text-xs text-white">{item.name}</p>
                  <p className="text-[10px] text-neutral-400">{item.count}</p>
                </div>
              ))}
            </div>

            {/* Liked / Favorite Songs List */}
            <div className="pt-2 space-y-2">
              <h3 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Favorite Tracks</h3>
              {MUSIC_CATALOG.filter((t) => likedTrackIds.includes(t.id)).map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => handlePlayTrack(idx)}
                  className="p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${t.coverGradient} flex items-center justify-center text-sm`}>
                      🎵
                    </div>
                    <div>
                      <p className="font-bold text-xs">{t.title}</p>
                      <p className="text-[10px] text-neutral-400">{t.artist}</p>
                    </div>
                  </div>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-3 animate-fade-in">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search artists, songs, lyrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none font-medium"
              />
            </div>

            {/* Results */}
            <div className="space-y-2">
              {filteredCatalog.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => handlePlayTrack(idx)}
                  className="p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${t.coverGradient} flex items-center justify-center text-lg`}>
                      🎵
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{t.title}</p>
                      <p className="text-[10px] text-neutral-400">{t.artist}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mini Player Bar (Sits immediately above bottom tabs) */}
      <div
        onClick={() => setIsFullPlayerOpen(true)}
        className="absolute bottom-12 left-2 right-2 rounded-2xl bg-neutral-900/95 backdrop-blur-2xl border border-neutral-700/60 p-2 flex items-center justify-between shadow-2xl z-30 cursor-pointer hover:bg-neutral-850 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${currentTrack.coverGradient} flex items-center justify-center text-sm shadow-xs shrink-0`}>
            🎵
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs truncate text-white">{currentTrack.title}</p>
            <p className="text-[10px] text-neutral-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleTogglePlayPause}
            className="p-1.5 rounded-full bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all"
          >
            {state.isPlayingMusic ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
          </button>
          <button
            onClick={handleNextTrack}
            className="p-1.5 text-neutral-400 hover:text-white"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Mini progress line at very top of player card */}
        <div className="absolute top-0 left-3 right-3 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-300"
            style={{ width: `${(elapsedSec / currentTrack.durationSec) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 flex justify-around items-center text-[10px] font-semibold text-neutral-500 z-30">
        <button
          onClick={() => setActiveTab('listen')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'listen' ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
        >
          <Play className="w-4 h-4" />
          <span>Listen Now</span>
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'browse' ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Browse</span>
        </button>
        <button
          onClick={() => setActiveTab('radio')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'radio' ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
        >
          <Radio className="w-4 h-4" />
          <span>Radio</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'library' ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
        >
          <Library className="w-4 h-4" />
          <span>Library</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'search' ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {/* FULLSCREEN NOW PLAYING MODAL */}
      {isFullPlayerOpen && (
        <div className="absolute inset-0 z-50 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white p-5 pt-14 flex flex-col justify-between animate-fade-in select-none">
          {/* Top Sheet Drag Handle & Collapse */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFullPlayerOpen(false)}
              className="p-1 rounded-full bg-neutral-800/80 text-neutral-300 hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Playing from {currentTrack.album}
              </span>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="p-1 text-neutral-400 hover:text-rose-500"
            >
              <Heart
                className={`w-5 h-5 ${likedTrackIds.includes(currentTrack.id) ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>

          {/* Player Center: Album Artwork OR Synced Lyrics */}
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            {playerViewMode === 'artwork' ? (
              <div className="flex flex-col items-center space-y-4 w-full">
                <div
                  className={`w-56 h-56 rounded-3xl bg-gradient-to-tr ${currentTrack.coverGradient} shadow-2xl flex items-center justify-center text-7xl relative overflow-hidden transition-transform duration-500 ${
                    state.isPlayingMusic ? 'scale-100 shadow-[0_20px_50px_rgba(225,29,72,0.35)]' : 'scale-90 opacity-80'
                  }`}
                >
                  <Disc3 className={`w-40 h-40 text-white/30 ${state.isPlayingMusic ? 'animate-spin-slow' : ''}`} />
                  <span className="absolute text-5xl">🎵</span>
                </div>

                {/* Spatial Audio & Lossless Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[9px] font-bold text-neutral-300 border border-neutral-700">
                    Lossless 24-bit/48kHz
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[9px] font-bold text-neutral-300 border border-neutral-700">
                    Dolby Atmos
                  </span>
                </div>
              </div>
            ) : (
              /* Karaoke Live Lyrics View */
              <div className="w-full h-56 overflow-y-auto space-y-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center font-medium">
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Realtime Lyrics</p>
                {currentTrack.lyrics.map((line, idx) => (
                  <p
                    key={idx}
                    className={`text-sm transition-all duration-300 ${
                      idx === Math.floor((elapsedSec / currentTrack.durationSec) * currentTrack.lyrics.length)
                        ? 'text-white font-bold scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                        : 'text-neutral-500'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Track Info & Quick Mode Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">{currentTrack.title}</h2>
                <p className="text-xs text-neutral-400">{currentTrack.artist}</p>
              </div>

              {/* YouTube Cross-Watch Button */}
              <button
                onClick={() => {
                  setIsFullPlayerOpen(false);
                  handleOpenYouTubeVideo(currentTrack.youtubeQuery);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Interactive Progress Scrub Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={currentTrack.durationSec}
                value={elapsedSec}
                onChange={(e) => setElapsedSec(Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 accent-rose-500 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>{formatTime(elapsedSec)}</span>
                <span>-{formatTime(currentTrack.durationSec - elapsedSec)}</span>
              </div>
            </div>

            {/* Playback Controls (Previous, Play/Pause, Next, Shuffle, Loop) */}
            <div className="flex items-center justify-between px-2 pt-1">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-rose-500' : 'text-neutral-500 hover:text-white'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevTrack}
                className="p-2 text-white hover:opacity-80 active:scale-90 transition-transform"
              >
                <SkipBack className="w-7 h-7 fill-white" />
              </button>

              <button
                onClick={handleTogglePlayPause}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
              >
                {state.isPlayingMusic ? (
                  <Pause className="w-6 h-6 fill-black" />
                ) : (
                  <Play className="w-6 h-6 fill-black ml-1" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-2 text-white hover:opacity-80 active:scale-90 transition-transform"
              >
                <SkipForward className="w-7 h-7 fill-white" />
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-rose-500' : 'text-neutral-500 hover:text-white'}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume & Bottom Utility Toggles (Lyrics, AirPlay) */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
              <button
                onClick={() => setPlayerViewMode(playerViewMode === 'artwork' ? 'lyrics' : 'artwork')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  playerViewMode === 'lyrics' ? 'bg-rose-500 text-white' : 'bg-neutral-850 text-neutral-300'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Lyrics</span>
              </button>

              <button
                onClick={() => setShowAirPlayModal(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-850 text-neutral-300 text-xs font-semibold hover:text-white"
              >
                <Airplay className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{activeAirplayDevice.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {/* AirPlay Output Selector Modal */}
          {showAirPlayModal && (
            <div
              onClick={() => setShowAirPlayModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-end p-4 z-50 animate-fade-in"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-4 space-y-3 text-white"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Audio Output Device</h3>
                  <button onClick={() => setShowAirPlayModal(false)} className="text-xs text-neutral-400">Done</button>
                </div>
                <div className="space-y-1">
                  {['iPhone (Built-in Speaker)', 'AirPods Pro (Spatial Audio)', 'Living Room HomePod', 'MacBook Pro AirPlay'].map((device) => (
                    <button
                      key={device}
                      onClick={() => {
                        setActiveAirplayDevice(device);
                        setShowAirPlayModal(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 flex items-center justify-between text-xs font-medium"
                    >
                      <span>{device}</span>
                      {activeAirplayDevice === device && <Check className="w-4 h-4 text-rose-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
