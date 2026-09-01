import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  MoreHorizontal,
  Download,
  Image as ImageIcon,
  Check,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FolderPlus,
  Send,
  Wallpaper,
  Camera,
  X
} from 'lucide-react';
import { SimulatorState } from '../../../types';
import { playFaceIdSuccessSound, playVolumeStepSound } from '../../../utils/audioUtils';

interface PinterestAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose?: () => void;
}

interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    isFollowing?: boolean;
  };
  board: string;
  category: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments?: Array<{ id: string; user: string; text: string; time: string }>;
  tags: string[];
}

const INITIAL_PINS: Pin[] = [
  {
    id: 'pin-1',
    title: 'Tropical Turquoise Shore & Palm Shadows',
    description: 'Crystal clear tropical ocean shallows with golden sunset glow. Perfect iPhone high-resolution wallpaper idea.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Elena Costa',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      handle: '@elenacosta'
    },
    board: 'Beach & Nature',
    category: 'Wallpapers',
    likes: 1420,
    commentsCount: 38,
    comments: [
      { id: 'c1', user: 'Sophia', text: 'Set this as my lockscreen immediately! Stunning colors 🌊', time: '2h ago' },
      { id: 'c2', user: 'Liam', text: 'The water clarity is unreal.', time: '5h ago' }
    ],
    tags: ['#Wallpaper', '#Beach', '#Tropical', '#Ocean', '#Summer']
  },
  {
    id: 'pin-2',
    title: 'Minimalist Clean Desk Setup with Warm Ambient Glow',
    description: 'Ultra-clean oak wood workspace with mechanical keyboard, studio monitor, and soft 2700K ambient LED lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Minimal Living Studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      handle: '@minimalliving'
    },
    board: 'Workspaces',
    category: 'Interior',
    likes: 2890,
    commentsCount: 94,
    comments: [
      { id: 'c3', user: 'Marcus', text: 'Where is the desk shelf from? So clean!', time: '1d ago' }
    ],
    tags: ['#DeskSetup', '#Workspace', '#Minimalist', '#Productivity', '#Interior']
  },
  {
    id: 'pin-3',
    title: 'Cyberpunk Tokyo Rain Reflections & Neon Signs',
    description: 'Shinjuku nightlife captured in heavy rain with vibrant purple and cyan neon reflections on asphalt.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      handle: '@kenjiphotos'
    },
    board: 'Street & Neon',
    category: 'Aesthetic',
    likes: 4120,
    commentsCount: 120,
    comments: [
      { id: 'c4', user: 'Aria', text: 'Blade Runner vibes, incredible shot! ⚡', time: '3h ago' }
    ],
    tags: ['#Tokyo', '#Cyberpunk', '#Neon', '#NightPhotography', '#Japan']
  },
  {
    id: 'pin-4',
    title: 'Artisan Latte Art & Morning Croissant',
    description: 'Fresh flaky buttery French pastry with specialty single-origin espresso rosetta latte in ceramic mug.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Café Nomad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      handle: '@cafenomad'
    },
    board: 'Food & Cafe',
    category: 'Food',
    likes: 980,
    commentsCount: 22,
    comments: [
      { id: 'c5', user: 'Chloe', text: 'My dream morning routine ☕🥐', time: '4h ago' }
    ],
    tags: ['#Coffee', '#LatteArt', '#Bakery', '#AestheticMorning', '#Cafe']
  },
  {
    id: 'pin-5',
    title: 'Amalfi Coast Terraces & Sunset Cliffside Villas',
    description: 'Pastel cliff houses in Positano overlooking the sparkling Mediterranean sea under golden sunset skies.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Wanderlust Guides',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      handle: '@wanderlust'
    },
    board: 'Travel Dreams',
    category: 'Travel',
    likes: 3450,
    commentsCount: 88,
    comments: [],
    tags: ['#Italy', '#Positano', '#AmalfiCoast', '#TravelGoals', '#SummerTrip']
  },
  {
    id: 'pin-6',
    title: 'Architectural Geometric Brutalism & Concrete Shadows',
    description: 'Sculptural concrete building facades with bold diagonal sunlight casting sharp shadow contrasts.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'ArchDesign Digest',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      handle: '@archdesign'
    },
    board: 'Architecture',
    category: 'Architecture',
    likes: 1890,
    commentsCount: 45,
    comments: [],
    tags: ['#Architecture', '#Brutalism', '#Design', '#Geometry', '#Structure']
  },
  {
    id: 'pin-7',
    title: 'Autumn Oversized Trench & Leather Loafers Outfit',
    description: 'Casual chic neutral tonal layering with beige wool coat, knit turtleneck, and black classic loafers.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Style Inspo Daily',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      handle: '@styleinspo'
    },
    board: 'Fashion Moods',
    category: 'Fashion',
    likes: 2150,
    commentsCount: 62,
    comments: [],
    tags: ['#Fashion', '#AutumnFit', '#OOTD', '#MinimalStyle', '#Wardrobe']
  },
  {
    id: 'pin-8',
    title: 'Dolomites Alpine Sunrise & Foggy Mountain Pine Forest',
    description: 'Majestic mountain peaks piercing through morning mist in northern Italy with emerald pine forest reflections.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Alpine Explorer',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      handle: '@alpineexplorer'
    },
    board: 'Nature & Hiking',
    category: 'Travel',
    likes: 5670,
    commentsCount: 140,
    comments: [],
    tags: ['#Mountains', '#Dolomites', '#Sunrise', '#Hiking', '#Nature']
  }
];

const BOARDS = [
  { id: 'b1', name: 'Dream Aesthetic 🌌', count: 18, cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80' },
  { id: 'b2', name: 'iOS 18 Wallpapers 📱', count: 24, cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80' },
  { id: 'b3', name: 'Minimal Workspaces 🪴', count: 12, cover: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&auto=format&fit=crop&q=80' },
  { id: 'b4', name: 'Travel Goals ✈️', count: 35, cover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&auto=format&fit=crop&q=80' },
  { id: 'b5', name: 'Fashion & Fits 👗', count: 16, cover: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&auto=format&fit=crop&q=80' }
];

export const PinterestApp: React.FC<PinterestAppProps> = ({ state, onUpdateState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'create' | 'updates' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveBoardModalPin, setSaveBoardModalPin] = useState<Pin | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Create Pin form state
  const [newPinTitle, setNewPinTitle] = useState('');
  const [newPinDesc, setNewPinDesc] = useState('');
  const [newPinImageUrl, setNewPinImageUrl] = useState('');
  const [newPinCategory, setNewPinCategory] = useState('Wallpapers');
  const [newPinBoard, setNewPinBoard] = useState(BOARDS[0].name);

  const categories = ['All', 'Wallpapers', 'Aesthetic', 'Interior', 'Travel', 'Food', 'Architecture', 'Fashion'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLikePin = (pinId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playVolumeStepSound();
    setPins((prev) =>
      prev.map((p) => {
        if (p.id === pinId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
    if (selectedPin && selectedPin.id === pinId) {
      setSelectedPin((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: !prev.isLiked ? prev.likes + 1 : prev.likes - 1
            }
          : null
      );
    }
  };

  const handleSaveToBoard = (boardName: string) => {
    if (!saveBoardModalPin) return;
    playFaceIdSuccessSound();
    const targetPin = saveBoardModalPin;
    setPins((prev) =>
      prev.map((p) => (p.id === targetPin.id ? { ...p, isSaved: true, board: boardName } : p))
    );
    if (selectedPin && selectedPin.id === targetPin.id) {
      setSelectedPin((prev) => (prev ? { ...prev, isSaved: true, board: boardName } : null));
    }
    setSaveBoardModalPin(null);
    showToast(`Saved to "${boardName}"! 📌`);
  };

  const handleSetAsWallpaper = (pin: Pin, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playFaceIdSuccessSound();

    // Check if we can save this image to userPhotos or set custom wallpaper
    onUpdateState((s) => ({
      ...s,
      wallpaper: 'beach', // Set theme or image
      userPhotos: [
        {
          id: `pin-wp-${Date.now()}`,
          title: `Pinterest: ${pin.title}`,
          url: pin.imageUrl,
          date: 'Just now',
          isFavorite: true,
          isCameraRoll: true
        },
        ...s.userPhotos
      ]
    }));
    showToast('Applied as iPhone Wallpaper & Saved to Photos! 📱✨');
  };

  const handleSaveToCameraRoll = (pin: Pin, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playVolumeStepSound();
    onUpdateState((s) => ({
      ...s,
      userPhotos: [
        {
          id: `pin-photo-${Date.now()}`,
          title: pin.title,
          url: pin.imageUrl,
          date: 'Just now',
          isFavorite: false,
          isCameraRoll: true
        },
        ...s.userPhotos
      ]
    }));
    showToast('Saved high-res image to Photos app! 📸');
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedPin) return;
    playVolumeStepSound();
    const commentObj = {
      id: `comm-${Date.now()}`,
      user: state.appleId.name.split(' ')[0] || 'You',
      text: newCommentText.trim(),
      time: 'Just now'
    };

    setPins((prev) =>
      prev.map((p) => {
        if (p.id === selectedPin.id) {
          const currentComments = p.comments || [];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [commentObj, ...currentComments]
          };
        }
        return p;
      })
    );

    setSelectedPin((prev) =>
      prev
        ? {
            ...prev,
            commentsCount: prev.commentsCount + 1,
            comments: [commentObj, ...(prev.comments || [])]
          }
        : null
    );

    setNewCommentText('');
    showToast('Comment posted! 💬');
  };

  const handleCreatePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinTitle.trim()) return;
    playFaceIdSuccessSound();

    const createdPin: Pin = {
      id: `pin-user-${Date.now()}`,
      title: newPinTitle.trim(),
      description: newPinDesc.trim() || 'Created on iOS Pinterest App',
      imageUrl:
        newPinImageUrl.trim() ||
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
      author: {
        name: state.appleId.name,
        avatar: state.appleId.avatar,
        handle: `@${state.appleId.name.toLowerCase().replace(/\s+/g, '')}`
      },
      board: newPinBoard,
      category: newPinCategory,
      likes: 1,
      isLiked: true,
      isSaved: true,
      commentsCount: 0,
      comments: [],
      tags: ['#CreatedByMe', `#${newPinCategory}`]
    };

    setPins([createdPin, ...pins]);
    setNewPinTitle('');
    setNewPinDesc('');
    setNewPinImageUrl('');
    setActiveTab('home');
    setSelectedPin(createdPin);
    showToast('Pin created and published successfully! 📌✨');
  };

  const filteredPins = pins.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans relative text-xs overflow-hidden`}>
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#E60023] text-white px-4 py-2 rounded-full shadow-2xl z-50 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Save to Board Modal */}
      {saveBoardModalPin && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in p-3">
          <div className={`rounded-3xl p-4 space-y-3 ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'} shadow-2xl max-h-[80%]`}>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-bold text-sm">Save Pin to Board</span>
              <button
                onClick={() => setSaveBoardModalPin(null)}
                className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60">
              <img
                src={saveBoardModalPin.imageUrl}
                alt={saveBoardModalPin.title}
                className="w-12 h-12 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs truncate">{saveBoardModalPin.title}</p>
                <p className="text-[10px] text-neutral-400">Choose destination collection</p>
              </div>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {BOARDS.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleSaveToBoard(b.name)}
                  className="p-2.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={b.cover} alt={b.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-semibold text-xs">{b.name}</p>
                      <p className="text-[10px] text-neutral-400">{b.count} Pins</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-[#E60023] text-white font-bold text-[11px] shadow-sm hover:opacity-90">
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PIN DETAIL MODAL */}
      {selectedPin && (
        <div className={`absolute inset-0 z-40 flex flex-col pt-10 ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} animate-fade-in overflow-hidden`}>
          {/* Top Bar */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setSelectedPin(null)}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center cursor-pointer hover:opacity-80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetAsWallpaper(selectedPin)}
                title="Set as iPhone Wallpaper"
                className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[10px] flex items-center gap-1 hover:bg-blue-500/20"
              >
                <Wallpaper className="w-3 h-3" />
                <span>Set Wallpaper</span>
              </button>
              <button
                onClick={() => setSaveBoardModalPin(selectedPin)}
                className="px-4 py-1.5 rounded-full bg-[#E60023] text-white font-bold text-xs shadow-md hover:bg-red-700"
              >
                {selectedPin.isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group border border-neutral-200 dark:border-neutral-800">
              <img
                src={selectedPin.imageUrl}
                alt={selectedPin.title}
                className="w-full max-h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={(e) => handleLikePin(selectedPin.id, e)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    selectedPin.isLiked ? 'bg-red-500 text-white' : 'bg-black/60 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedPin.isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => handleSaveToCameraRoll(selectedPin, e)}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-lg active:scale-90"
                  title="Download to Camera Roll"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Author Profile Row */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPin.author.avatar}
                  alt={selectedPin.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-xs">{selectedPin.author.name}</h4>
                  <p className="text-[10px] text-neutral-400">{selectedPin.author.handle} • 14.5k followers</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playVolumeStepSound();
                  showToast('Following creator! ⭐️');
                }}
                className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 font-bold text-[11px]"
              >
                Follow
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h2 className="font-bold text-base leading-snug">{selectedPin.title}</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {selectedPin.description}
              </p>
            </div>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPin.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between py-2 border-y border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-semibold text-neutral-600 dark:text-neutral-300">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                  {selectedPin.likes} likes
                </span>
                <span className="flex items-center gap-1 font-semibold text-neutral-600 dark:text-neutral-300">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                  {selectedPin.commentsCount} comments
                </span>
              </div>
              <button
                onClick={() => {
                  playVolumeStepSound();
                  showToast('Pinterest link copied to clipboard! 🔗');
                }}
                className="flex items-center gap-1 text-blue-500 font-bold text-[11px]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs uppercase text-neutral-400 tracking-wider">Comments</h3>

              {/* Add Comment Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a friendly comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                  className="flex-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                  className="w-8 h-8 rounded-full bg-[#E60023] disabled:opacity-40 text-white flex items-center justify-center shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(selectedPin.comments || []).map((c) => (
                  <div key={c.id} className="p-2.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/40 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px]">{c.user}</span>
                      <span className="text-[9px] text-neutral-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="pt-11 pb-2 px-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md z-10 shrink-0">
        {/* Pinterest Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-[#E60023] text-white font-black flex items-center justify-center text-base shadow-sm">
            P
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#E60023]">Pinterest</span>
        </div>

        {/* Categories Chips in Home View */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[170px] py-0.5">
            {categories.slice(0, 4).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-full font-bold text-[10px] whitespace-nowrap transition-colors ${
                  selectedCategory === c
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Profile Avatar Badge */}
        <div
          onClick={() => setActiveTab('profile')}
          className="w-7 h-7 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 cursor-pointer"
        >
          <img src={state.appleId.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* MAIN VIEW TABS */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: HOME DISCOVERY FEED */}
        {activeTab === 'home' && (
          <div className="space-y-3">
            {/* Category horizontal scroll list */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === c
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* 2-Column Pinterest Staggered Masonry Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredPins.map((pin, idx) => (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className="rounded-2xl overflow-hidden group cursor-pointer space-y-1.5 relative flex flex-col"
                >
                  {/* Pin Image Container */}
                  <div className="relative rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-sm">
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        idx % 3 === 0 ? 'h-52' : idx % 2 === 0 ? 'h-40' : 'h-48'
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick Save Hover Pill */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSaveBoardModalPin(pin);
                      }}
                      className="absolute top-2 right-2 px-3 py-1 rounded-full bg-[#E60023] text-white font-bold text-[10px] shadow-md hover:bg-red-700 active:scale-95 transition-all"
                    >
                      {pin.isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  {/* Pin Title & Meta */}
                  <div className="px-0.5 space-y-0.5">
                    <h3 className="font-semibold text-xs leading-tight line-clamp-2">{pin.title}</h3>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1 truncate max-w-[80px]">
                        <img
                          src={pin.author.avatar}
                          alt={pin.author.name}
                          className="w-3.5 h-3.5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="truncate">{pin.author.name}</span>
                      </div>
                      <div
                        onClick={(e) => handleLikePin(pin.id, e)}
                        className="flex items-center gap-0.5 cursor-pointer hover:text-red-500"
                      >
                        <Heart className={`w-3 h-3 ${pin.isLiked ? 'text-red-500 fill-current' : ''}`} />
                        <span>{pin.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH & VISUAL EXPLORE */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-700">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search for ideas, wallpapers, aesthetic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs focus:outline-hidden"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              )}
            </div>

            {/* Trending Keywords */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-1">
                Trending on Pinterest
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '#iOS18Wallpapers',
                  '#MinimalistSetup',
                  '#CyberpunkTokyo',
                  '#AmalfiSunset',
                  '#DarkAcademia',
                  '#CoffeeAesthetic',
                  '#QuietLuxury'
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag.replace('#', ''))}
                    className="px-3 py-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results / Visual Boards */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-1">
                Popular Ideas
              </span>
              <div className="grid grid-cols-2 gap-2">
                {BOARDS.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedCategory(b.name.split(' ')[0]);
                      setActiveTab('home');
                    }}
                    className="relative h-24 rounded-2xl overflow-hidden shadow-sm cursor-pointer group border border-neutral-200 dark:border-neutral-800"
                  >
                    <img
                      src={b.cover}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                      <span className="text-white font-bold text-xs">{b.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CREATE PIN (+) */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreatePinSubmit} className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                Publish your own creative idea, design, or photo to your Pinterest board.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Pin Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Silhouette at Marine Drive"
                  value={newPinTitle}
                  onChange={(e) => setNewPinTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell everyone what your Pin is about..."
                  value={newPinDesc}
                  onChange={(e) => setNewPinDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Image URL (or select from presets below)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPinImageUrl}
                  onChange={(e) => setNewPinImageUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden font-mono text-[10px]"
                />

                {/* Preset image suggestions from phone photos */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&auto=format&fit=crop&q=80'
                  ].map((presetUrl, idx) => (
                    <img
                      key={idx}
                      src={presetUrl}
                      alt="Preset"
                      onClick={() => setNewPinImageUrl(presetUrl)}
                      className={`h-14 w-full rounded-xl object-cover cursor-pointer border-2 ${
                        newPinImageUrl === presetUrl ? 'border-[#E60023]' : 'border-transparent'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={newPinCategory}
                    onChange={(e) => setNewPinCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Board
                  </label>
                  <select
                    value={newPinBoard}
                    onChange={(e) => setNewPinBoard(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-hidden"
                  >
                    {BOARDS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#E60023] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Publish Pin 📌
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: UPDATES & NOTIFICATIONS */}
        {activeTab === 'updates' && (
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider px-1">
              Recent Activity & Idea Digests
            </span>

            {[
              {
                id: 'u1',
                title: 'Popular in Wallpapers',
                desc: 'Tropical Turquoise Shore is trending with 1,400+ saves today.',
                time: '1h ago',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80'
              },
              {
                id: 'u2',
                title: 'Elena Costa saved your Pin',
                desc: 'Added to board "Creative Workspaces & Moodboards"',
                time: '3h ago',
                img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=100&auto=format&fit=crop&q=80'
              },
              {
                id: 'u3',
                title: 'Weekly Inspiration Digest',
                desc: 'Discover top curated interior aesthetics for September 2026.',
                time: '1d ago',
                img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&auto=format&fit=crop&q=80'
              }
            ].map((u) => (
              <div key={u.id} className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center gap-3">
                <img src={u.img} alt={u.title} className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs truncate">{u.title}</h4>
                    <span className="text-[9px] text-neutral-400">{u.time}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PROFILE & SAVED BOARDS */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-center">
            {/* User Profile Header */}
            <div className="flex flex-col items-center space-y-2 pt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#E60023] shadow-md">
                <img src={state.appleId.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{state.appleId.name}</h3>
                <p className="text-[10px] text-neutral-400">@vishnusairamiya • 120 followers • 84 following</p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-3.5 py-1 rounded-full bg-[#E60023] text-white font-bold text-[11px] shadow-xs hover:bg-red-700"
                >
                  + Create Pin
                </button>
                <button
                  onClick={() => showToast('Profile settings synced with Apple ID!')}
                  className="px-3.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 font-bold text-[11px]"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Boards Grid */}
            <div className="space-y-2 text-left pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-xs uppercase text-neutral-400 tracking-wider">Your Boards</span>
                <span className="text-[10px] text-neutral-400">{BOARDS.length} Boards</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {BOARDS.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedCategory(b.name.split(' ')[0]);
                      setActiveTab('home');
                    }}
                    className="rounded-2xl p-2 bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50 cursor-pointer hover:opacity-90 space-y-1.5"
                  >
                    <img src={b.cover} alt={b.name} className="w-full h-24 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-xs truncate">{b.name}</h4>
                      <p className="text-[10px] text-neutral-400">{b.count} Pins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM PINTEREST TAB BAR */}
      <div className="py-2 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md flex justify-between items-center z-10 shrink-0">
        <button
          onClick={() => {
            setActiveTab('home');
            playVolumeStepSound();
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'home' ? 'text-[#E60023]' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center font-black text-sm">
            P
          </div>
          <span className="text-[9px] font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            playVolumeStepSound();
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'search' ? 'text-[#E60023]' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[9px] font-bold">Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('create');
            playVolumeStepSound();
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'create' ? 'text-[#E60023]' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center -mt-1 shadow-sm">
            <Plus className="w-4 h-4 text-black dark:text-white" />
          </div>
          <span className="text-[9px] font-bold">Create</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('updates');
            playVolumeStepSound();
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'updates' ? 'text-[#E60023]' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="text-[9px] font-bold">Updates</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            playVolumeStepSound();
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'profile' ? 'text-[#E60023]' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
          }`}
        >
          <div className={`w-4 h-4 rounded-full overflow-hidden border ${activeTab === 'profile' ? 'border-[#E60023]' : 'border-neutral-400'}`}>
            <img src={state.appleId.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-[9px] font-bold">Saved</span>
        </button>
      </div>
    </div>
  );
};
