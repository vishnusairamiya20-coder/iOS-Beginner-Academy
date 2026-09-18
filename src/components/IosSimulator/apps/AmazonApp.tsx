import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  ChevronRight,
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Trash2,
  Camera,
  Mic,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Package,
  CreditCard,
  Wallet,
  X,
  Share2,
  CheckCircle2,
  Tag,
  ArrowRight,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ThumbsUp,
  MapPinOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulatorState, IosAppId } from '../../../types';
import { playSuccessChime, playBiometricTickSound } from '../../../utils/audioUtils';

interface AmazonAppProps {
  state: SimulatorState;
  onUpdateState?: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp?: (app: IosAppId) => void;
  onClose: () => void;
}

export interface AmazonProduct {
  id: string;
  title: string;
  category: 'all' | 'electronics' | 'fashion' | 'home' | 'devices' | 'deals';
  brand: string;
  badge?: "Best Seller" | "Amazon's Choice" | "Limited Time Deal";
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  prime: boolean;
  deliveryDate: string;
  inStockCount: number;
  imageEmoji: string;
  bgColor: string;
  description: string;
  features: string[];
  specs: { [key: string]: string };
  colors?: string[];
  reviews: {
    author: string;
    avatarEmoji: string;
    rating: number;
    title: string;
    date: string;
    verified: boolean;
    body: string;
    helpfulCount: number;
  }[];
}

export interface CartItem {
  product: AmazonProduct;
  quantity: number;
  selectedColor?: string;
  selected: boolean;
}

export interface AmazonOrder {
  id: string;
  date: string;
  items: {
    title: string;
    price: number;
    quantity: number;
    emoji: string;
  }[];
  total: number;
  status: 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  deliveryAddress: string;
}

const PRODUCTS: AmazonProduct[] = [
  {
    id: 'prod-1',
    title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)',
    category: 'electronics',
    brand: 'Apple',
    badge: 'Amazon\'s Choice',
    rating: 4.8,
    reviewsCount: 52830,
    price: 189.99,
    originalPrice: 249.00,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 14,
    imageEmoji: '🎧',
    bgColor: 'from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Up to 2x more active noise cancellation. Adaptive Audio, Transparency mode, Personalized Spatial Audio, and battery life up to 30 hours.',
    features: [
      'Active Noise Cancellation reduces unwanted background noise',
      'Adaptive Audio dynamically blends Transparency and ANC',
      'Personalized Spatial Audio with dynamic head tracking',
      'Dust, sweat, and water resistant (IP54)'
    ],
    specs: {
      'Brand': 'Apple',
      'Model': 'AirPods Pro 2',
      'Connectivity': 'Bluetooth 5.3',
      'Battery Life': 'Up to 30 Hours',
      'Port': 'USB-C'
    },
    colors: ['White'],
    reviews: [
      {
        author: 'Michael B.',
        avatarEmoji: '👨🏻‍💻',
        rating: 5,
        title: 'Best ANC earbuds on the market hands down',
        date: '3 days ago',
        verified: true,
        body: 'The noise cancellation is shockingly good on flights and trains. USB-C case makes charging so convenient now.',
        helpfulCount: 412
      },
      {
        author: 'Sarah K.',
        avatarEmoji: '👩🏼',
        rating: 5,
        title: 'Seamless Apple ecosystem integration',
        date: '1 week ago',
        verified: true,
        body: 'Switches automatically between my Mac, iPad, and iPhone without a hitch. Worth every single penny.',
        helpfulCount: 198
      }
    ]
  },
  {
    id: 'prod-2',
    title: 'All-new Amazon Echo Dot (5th Gen) Smart Speaker with Alexa',
    category: 'devices',
    brand: 'Amazon',
    badge: 'Best Seller',
    rating: 4.7,
    reviewsCount: 89120,
    price: 29.99,
    originalPrice: 49.99,
    prime: true,
    deliveryDate: 'Tomorrow, by 8 AM (Overnight)',
    inStockCount: 42,
    imageEmoji: '🔊',
    bgColor: 'from-sky-50 to-cyan-100 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Our best sounding Echo Dot yet. Enjoy an improved audio experience compared to any previous Echo Dot for clearer vocals, deeper bass, and vibrant sound.',
    features: [
      'Vibrant sound and deeper bass for music, podcasts, and audiobooks',
      'Ask Alexa for weather updates, timers, hands-free questions, and jokes',
      'Motion detection and indoor temperature sensor built-in',
      'Designed to protect your privacy with mic-off button'
    ],
    specs: {
      'Brand': 'Amazon',
      'Dimensions': '3.9"W x 3.5"H',
      'Audio': '1.73" front-firing speaker',
      'Smart Assistant': 'Amazon Alexa'
    },
    colors: ['Charcoal', 'Glacier White', 'Deep Sea Blue'],
    reviews: [
      {
        author: 'David P.',
        avatarEmoji: '🧔🏻',
        rating: 5,
        title: 'Significant sound improvement over 4th gen',
        date: '5 days ago',
        verified: true,
        body: 'Audio fills a medium bedroom easily. The temperature trigger routines work like a charm for our smart fan.',
        helpfulCount: 245
      }
    ]
  },
  {
    id: 'prod-3',
    title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    category: 'electronics',
    brand: 'Sony',
    badge: 'Limited Time Deal',
    rating: 4.6,
    reviewsCount: 23140,
    price: 328.00,
    originalPrice: 399.99,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 8,
    imageEmoji: '🎙️',
    bgColor: 'from-neutral-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Two processors and 8 microphones for unprecedented noise cancellation. Exceptional sound quality with newly developed driver.',
    features: [
      'Magnificent sound engineered to perfection with High-Resolution Audio',
      'Crystal-clear hands-free calling with 4 beamforming microphones',
      'Up to 30-hour battery life with quick charging (3 min for 3 hours playback)',
      'Ultra-comfortable lightweight design with soft fit leather'
    ],
    specs: {
      'Brand': 'Sony',
      'Noise Control': 'Active Noise Cancellation',
      'Battery': '30 Hours',
      'Weight': '250 grams'
    },
    colors: ['Black', 'Silver', 'Midnight Blue'],
    reviews: [
      {
        author: 'Elena R.',
        avatarEmoji: '👩🏽',
        rating: 5,
        title: 'Silence on demand in open office',
        date: '2 weeks ago',
        verified: true,
        body: 'Blocks cafe chatter, office hums, and AC noise like magic. Incredibly light on head during 8-hour workdays.',
        helpfulCount: 165
      }
    ]
  },
  {
    id: 'prod-4',
    title: 'Kindle Paperwhite (16 GB) – Now with 6.8" display and adjustable warm light',
    category: 'devices',
    brand: 'Amazon',
    badge: 'Best Seller',
    rating: 4.9,
    reviewsCount: 67200,
    price: 129.99,
    originalPrice: 149.99,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 25,
    imageEmoji: '📖',
    bgColor: 'from-amber-50 to-orange-100 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Read anywhere with a glare-free 300 ppi display that reads like real paper, even in bright sunlight. Adjustable warm light to shift screen shade from white to amber.',
    features: [
      '6.8" display with thinner borders and 20% faster page turns',
      'Waterproof (IPX8) for reading by the pool or in the bath',
      'A single charge via USB-C lasts up to 10 weeks',
      'Adjustable warm light to read comfortably day or night'
    ],
    specs: {
      'Display': '6.8" Paperwhite 300 ppi',
      'Storage': '16 GB',
      'Battery': 'Up to 10 Weeks',
      'Waterproofing': 'IPX8'
    },
    colors: ['Black', 'Agave Green', 'Denim'],
    reviews: [
      {
        author: 'Robert M.',
        avatarEmoji: '👨🏼‍🦳',
        rating: 5,
        title: 'The warm light is a bedtime game-changer',
        date: '4 days ago',
        verified: true,
        body: 'Warm light makes night reading so easy on the eyes. The battery literally lasts for weeks without thinking about it.',
        helpfulCount: 310
      }
    ]
  },
  {
    id: 'prod-5',
    title: 'Ninja AF101 Air Fryer that Crisps, Roasts, Reheats & Dehydrates (4 Qt)',
    category: 'home',
    brand: 'Ninja',
    badge: 'Amazon\'s Choice',
    rating: 4.8,
    reviewsCount: 78400,
    price: 89.95,
    originalPrice: 129.99,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 19,
    imageEmoji: '🍟',
    bgColor: 'from-orange-50 to-red-100 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Quickly cook and crisp your favorite foods with 75% less fat than traditional frying methods. 4-quart ceramic-coated basket fits 2 lbs of french fries.',
    features: [
      'Guilt-free fried food: Up to 75% less fat than deep frying',
      'Wide temperature range: 105°F to 400°F',
      '4-in-1 versatility: Air Fry, Air Roast, Reheat, and Dehydrate',
      'Dishwasher-safe ceramic coated basket and crisper plate'
    ],
    specs: {
      'Capacity': '4 Quarts',
      'Wattage': '1500 Watts',
      'Control Method': 'Touch Digital'
    },
    colors: ['Black / Grey'],
    reviews: [
      {
        author: 'Jessica T.',
        avatarEmoji: '👩🏻',
        rating: 5,
        title: 'Use this every single day',
        date: '1 week ago',
        verified: true,
        body: 'Chicken wings, roasted broccoli, crisp bacon, reheated pizza—everything comes out 10x better than the microwave or oven.',
        helpfulCount: 520
      }
    ]
  },
  {
    id: 'prod-6',
    title: 'Hydro Flask All Around Travel Tumbler with Handle & Flex Straw (32 oz)',
    category: 'home',
    brand: 'Hydro Flask',
    badge: 'Limited Time Deal',
    rating: 4.7,
    reviewsCount: 14200,
    price: 34.95,
    originalPrice: 44.95,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 31,
    imageEmoji: '🥤',
    bgColor: 'from-teal-50 to-emerald-100 dark:from-neutral-800 dark:to-neutral-900',
    description: 'TempShield double-wall vacuum insulation keeps drinks cold for 24+ hours. Cup holder compatible with comfortable ergonomic handle.',
    features: [
      'TempShield vacuum insulation protects temperature for hours',
      'Flexible straw top is leak-resistant and easy to sip on the go',
      'Fits most cup holders effortlessly',
      'BPA-Free and Pro-Grade 18/8 stainless steel construction'
    ],
    specs: {
      'Capacity': '32 oz',
      'Material': '18/8 Pro Stainless Steel',
      'Dishwasher Safe': 'Yes'
    },
    colors: ['Oat', 'Pacific Blue', 'Black', 'Agave'],
    reviews: [
      {
        author: 'Chloe L.',
        avatarEmoji: '👱🏼‍♀️',
        rating: 5,
        title: 'Doesn\'t leak in my gym bag',
        date: '3 weeks ago',
        verified: true,
        body: 'Ice stays solid well into day two. The handle makes it so easy to carry everywhere.',
        helpfulCount: 144
      }
    ]
  },
  {
    id: 'prod-7',
    title: 'Logitech MX Master 3S Performance Wireless Ergonomic Mouse',
    category: 'electronics',
    brand: 'Logitech',
    badge: 'Amazon\'s Choice',
    rating: 4.8,
    reviewsCount: 38900,
    price: 98.99,
    originalPrice: 109.99,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 16,
    imageEmoji: '🖱️',
    bgColor: 'from-slate-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Any-surface tracking with 8K DPI sensor. Quiet clicks feel satisfying while creating 90% less noise. MagSpeed electromagnetic scrolling.',
    features: [
      'MagSpeed scrolling scrolls 1,000 lines in 1 second and stops on a pixel',
      'Quiet Clicks technology reduces 90% of click sound',
      '8,000 DPI optical sensor tracks on glass surfaces',
      'Connect up to 3 devices via Bluetooth or Logi Bolt receiver'
    ],
    specs: {
      'Sensor': '8,000 DPI Darkfield',
      'Battery': 'Up to 70 days per charge',
      'Connectivity': 'Bluetooth / USB Bolt'
    },
    colors: ['Space Gray', 'Pale Gray'],
    reviews: [
      {
        author: 'Marcus W.',
        avatarEmoji: '👨🏾‍💻',
        rating: 5,
        title: 'The ultimate mouse for productivity',
        date: '6 days ago',
        verified: true,
        body: 'The thumb wheel for horizontal spreadsheets alone saved my sanity. Hand fatigue is completely gone.',
        helpfulCount: 280
      }
    ]
  },
  {
    id: 'prod-8',
    title: 'Nike Club Fleece Pullover Hoodie – Classic Athletic Fit',
    category: 'fashion',
    brand: 'Nike',
    badge: 'Best Seller',
    rating: 4.6,
    reviewsCount: 19800,
    price: 52.00,
    originalPrice: 65.00,
    prime: true,
    deliveryDate: 'Tomorrow, by 10 PM',
    inStockCount: 22,
    imageEmoji: '🧥',
    bgColor: 'from-stone-100 to-zinc-200 dark:from-neutral-800 dark:to-neutral-900',
    description: 'Brushed fleece fabric feels soft and smooth against your skin. Ribbed hem and cuffs provide a secure fit that stays in place while you move.',
    features: [
      'Standard fit for a relaxed, easy feel',
      'Hood with drawstring lets you adjust your coverage',
      'Front kangaroo pocket to warm hands or stash essentials',
      'Machine wash safe'
    ],
    specs: {
      'Material': '80% Cotton / 20% Polyester',
      'Fit': 'Standard Relaxed',
      'Care': 'Machine wash cold'
    },
    colors: ['Heather Grey', 'Black', 'Navy'],
    reviews: [
      {
        author: 'Anthony D.',
        avatarEmoji: '🧔🏻‍♂️',
        rating: 5,
        title: 'Super soft and holds up after multiple washes',
        date: '1 week ago',
        verified: true,
        body: 'Fits true to size. Soft interior didn\'t pill in the dryer. Will definitely buy another color.',
        helpfulCount: 88
      }
    ]
  }
];

export const AmazonApp: React.FC<AmazonAppProps> = ({ state, onClose }) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'you' | 'cart' | 'menu'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'deals' | 'electronics' | 'devices' | 'home' | 'fashion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<AmazonProduct | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: 'White',
      selected: true
    },
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedColor: 'Charcoal',
      selected: true
    }
  ]);

  // Orders state
  const [orders, setOrders] = useState<AmazonOrder[]>([
    {
      id: '114-8923011-4491022',
      date: 'Placed yesterday',
      items: [
        {
          title: 'Apple AirPods Pro (2nd Gen)',
          price: 189.99,
          quantity: 1,
          emoji: '🎧'
        }
      ],
      total: 206.14,
      status: 'out_for_delivery',
      trackingNumber: 'TBA30948192801',
      estimatedDelivery: 'Arriving today by 7 PM',
      deliveryAddress: 'Alex Doe, 742 Evergreen Terrace, Seattle WA 98101'
    },
    {
      id: '114-5509214-9982312',
      date: 'Delivered Sep 12',
      items: [
        {
          title: 'Kindle Paperwhite (16 GB)',
          price: 129.99,
          quantity: 1,
          emoji: '📖'
        }
      ],
      total: 141.04,
      status: 'delivered',
      trackingNumber: 'TBA19283746109',
      estimatedDelivery: 'Delivered at front door',
      deliveryAddress: 'Alex Doe, 742 Evergreen Terrace, Seattle WA 98101'
    }
  ]);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'processing' | 'success'>('review');
  const [selectedAddress, setSelectedAddress] = useState('Home (742 Evergreen Terrace, Seattle, WA 98101)');
  const [selectedPayment, setSelectedPayment] = useState<'amazon_pay' | 'visa' | 'apple_pay'>('amazon_pay');
  const [amazonPayBalance, setAmazonPayBalance] = useState(250.00);

  // Active address sheet
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);

  // Flash deal countdown timer
  const [flashDealSeconds, setFlashDealSeconds] = useState(14520);
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashDealSeconds((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart
      .filter((i) => i.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Search filter
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'deals'
          ? p.badge === 'Limited Time Deal' || p.originalPrice > p.price
          : p.category === selectedCategory;

      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (product: AmazonProduct, color?: string) => {
    playBiometricTickSound();
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedColor: color || product.colors?.[0],
            selected: true
          }
        ];
      }
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    playBiometricTickSound();
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const toggleItemSelection = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    playBiometricTickSound();
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Place Order handler
  const handlePlaceOrder = () => {
    setCheckoutStep('processing');
    playBiometricTickSound();

    setTimeout(() => {
      playSuccessChime();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });

      const selectedItems = cart.filter((i) => i.selected);
      const orderTotal = cartSubtotal * 1.085; // 8.5% tax

      if (selectedPayment === 'amazon_pay' && amazonPayBalance >= orderTotal) {
        setAmazonPayBalance((prev) => prev - orderTotal);
      }

      const newOrder: AmazonOrder = {
        id: `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        date: 'Placed just now',
        items: selectedItems.map((i) => ({
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          emoji: i.product.imageEmoji
        })),
        total: orderTotal,
        status: 'ordered',
        trackingNumber: `TBA${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        estimatedDelivery: 'Arriving Tomorrow by 8 PM',
        deliveryAddress: selectedAddress
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart((prev) => prev.filter((i) => !i.selected));
      setCheckoutStep('success');
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-[#f3f3f3] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col select-none font-sans overflow-hidden">
      {/* Top Amazon Branded App Bar */}
      <div className="bg-[#131921] text-white pt-11 px-3 pb-2.5 shadow-md flex-shrink-0 z-30">
        {/* Row 1: Logo, Deliver To Pin, Notifications */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Amazon Logo with Smile */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tighter leading-none text-white">
                amazon<span className="text-[#febd69] font-normal text-xs ml-0.5">.com</span>
              </span>
              <svg className="w-14 h-2.5 -mt-0.5" viewBox="0 0 100 20" fill="none">
                <path
                  d="M10 5 C 40 18, 70 18, 95 6"
                  stroke="#ff9900"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M93 1 C 97 5, 96 11, 91 14"
                  stroke="#ff9900"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="bg-[#febd69] text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase ml-1">
              Prime
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('you')}
              className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-[#febd69]" />
              <span className="font-semibold max-w-[50px] truncate">Alex</span>
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-1 hover:text-[#febd69] transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff9900] text-neutral-900 text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border border-[#131921]">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Search Bar with Camera Scan and Mic */}
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black pl-9 pr-16 py-2 rounded-lg text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff9900] shadow-inner"
          />
          <div className="absolute right-2.5 flex items-center gap-2 text-neutral-500">
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="p-0.5 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setSearchQuery('AirPods')}
                  title="Scan product"
                  className="hover:text-black transition-colors"
                >
                  <Camera className="w-4 h-4 text-neutral-600" />
                </button>
                <button
                  onClick={() => setSearchQuery('Echo')}
                  title="Alexa voice search"
                  className="hover:text-black transition-colors"
                >
                  <Mic className="w-4 h-4 text-sky-600" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Bar subheader */}
      <div
        onClick={() => setIsAddressSheetOpen(true)}
        className="bg-[#232f3e] text-white px-3 py-1.5 flex items-center justify-between text-xs cursor-pointer hover:bg-[#2b3a4c] transition-colors border-t border-white/5 flex-shrink-0"
      >
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#febd69] flex-shrink-0" />
          <span className="truncate text-neutral-200">
            Deliver to Alex - <span className="font-semibold text-white">Seattle 98101 ▾</span>
          </span>
        </div>
        <span className="text-[10px] text-[#febd69] font-medium flex-shrink-0 ml-2">Change</span>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="pb-24 animate-fade-in">
            {/* Category horizontal pills */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-2 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-sm">
              {[
                { id: 'all', label: 'All' },
                { id: 'deals', label: '⚡ Deals', badge: 'Sale' },
                { id: 'electronics', label: 'Electronics' },
                { id: 'devices', label: 'Amazon Devices' },
                { id: 'home', label: 'Home & Kitchen' },
                { id: 'fashion', label: 'Fashion' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playBiometricTickSound();
                    setSelectedCategory(cat.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#131921] text-white dark:bg-[#febd69] dark:text-neutral-950 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                  {cat.badge && (
                    <span className="bg-red-500 text-white text-[9px] px-1 rounded-full font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Prime Banner Promo */}
            <div className="m-3 p-3.5 bg-gradient-to-r from-[#00A8E1] via-[#008296] to-[#002F36] rounded-xl text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="bg-white text-[#00A8E1] text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                    prime
                  </span>
                  <span className="text-xs font-semibold text-cyan-100">Big Deal Days</span>
                </div>
                <h2 className="text-base font-black tracking-tight leading-tight mb-1">
                  Save up to 40% on Apple, Sony & Echo
                </h2>
                <div className="flex items-center gap-3 text-xs text-cyan-50 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#febd69]" /> Ends in {formatCountdown(flashDealSeconds)}
                  </span>
                  <span className="font-bold text-[#febd69] bg-black/20 px-2 py-0.5 rounded">
                    FREE 1-Day Delivery
                  </span>
                </div>
              </div>
              <div className="absolute right-2 -bottom-2 text-6xl opacity-20 select-none pointer-events-none">
                📦
              </div>
            </div>

            {/* Flash Deal Carousel Card */}
            <div className="mx-3 mb-4 bg-white dark:bg-neutral-900 rounded-xl p-3 shadow-sm border border-neutral-200/80 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Deal of the Day
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    AirPods Pro 2
                  </span>
                </div>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  24% OFF
                </span>
              </div>
              <div
                onClick={() => setSelectedProduct(PRODUCTS[0])}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  🎧
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-[#007185] transition-colors">
                    Apple AirPods Pro (2nd Generation) with USB-C MagSafe Charging Case
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-black text-neutral-900 dark:text-white">
                      $189.99
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      $249.00
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#007185] dark:text-cyan-400 font-medium mt-0.5">
                    <span className="font-black text-[#00A8E1]">prime</span> FREE Delivery Tomorrow
                  </div>
                </div>
              </div>
            </div>

            {/* Product Feed Grid */}
            <div className="px-3">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  Recommended for You
                  <span className="text-xs font-normal text-neutral-500">({filteredProducts.length})</span>
                </h3>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs text-[#007185] dark:text-cyan-400 font-semibold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-neutral-500">
                  <Package className="w-10 h-10 mx-auto mb-2 text-neutral-400" />
                  <p className="text-sm font-semibold">No items match your search</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-3 px-4 py-1.5 bg-[#febd69] text-black text-xs font-bold rounded-lg"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 flex flex-col justify-between border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                    >
                      {/* Badge if available */}
                      {product.badge && (
                        <span
                          className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide z-10 ${
                            product.badge === 'Best Seller'
                              ? 'bg-[#e67a00] text-white'
                              : product.badge === "Amazon's Choice"
                              ? 'bg-[#131921] text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Product Visual */}
                      <div
                        className={`w-full h-32 bg-gradient-to-br ${product.bgColor} rounded-lg flex items-center justify-center text-5xl mb-2 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}
                      >
                        <span>{product.imageEmoji}</span>
                        {product.originalPrice > product.price && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                            {product.brand}
                          </p>
                          <h4 className="text-xs font-bold line-clamp-2 leading-snug mt-0.5 text-neutral-800 dark:text-neutral-200">
                            {product.title}
                          </h4>

                          {/* Star Ratings */}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-neutral-300 text-neutral-300 dark:fill-neutral-700 dark:text-neutral-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#007185] dark:text-cyan-400 font-medium">
                              {product.reviewsCount.toLocaleString()}
                            </span>
                          </div>

                          {/* Price & Prime */}
                          <div className="mt-1.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black text-neutral-900 dark:text-white">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-[10px] text-neutral-400 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {product.prime && (
                              <div className="flex items-center gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                                <span className="font-extrabold text-[#00A8E1] tracking-tight">prime</span>
                                <span className="truncate">One-Day</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Fast Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="mt-2.5 w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-neutral-900 rounded-full text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: YOU / ACCOUNT ================= */}
        {activeTab === 'you' && (
          <div className="p-3 pb-24 animate-fade-in">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-3.5 shadow-sm border border-neutral-200 dark:border-neutral-800 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#131921] to-[#232f3e] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  AD
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Alex Doe
                    </h3>
                    <span className="bg-[#febd69] text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      Prime
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">alex.doe@example.com</p>
                </div>
              </div>

              {/* Amazon Pay Balance Widget */}
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 font-semibold block">
                  Amazon Pay
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  ${amazonPayBalance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  const ordersSection = document.getElementById('orders-section');
                  ordersSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left font-bold text-xs shadow-sm hover:border-[#febd69] transition-all"
              >
                📦 Your Orders
                <span className="block text-[11px] font-normal text-neutral-500 mt-0.5">
                  {orders.length} active orders
                </span>
              </button>
              <button
                onClick={() => {
                  if (orders.length > 0) {
                    addToCart(PRODUCTS[0]);
                  }
                }}
                className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left font-bold text-xs shadow-sm hover:border-[#febd69] transition-all"
              >
                🔄 Buy Again
                <span className="block text-[11px] font-normal text-neutral-500 mt-0.5">
                  AirPods, Kindle & more
                </span>
              </button>
              <button
                onClick={() => setIsAddressSheetOpen(true)}
                className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left font-bold text-xs shadow-sm hover:border-[#febd69] transition-all"
              >
                📍 Addresses
                <span className="block text-[11px] font-normal text-neutral-500 mt-0.5">
                  Seattle, WA (Default)
                </span>
              </button>
              <button
                onClick={() => {
                  playBiometricTickSound();
                  setAmazonPayBalance((prev) => prev + 50);
                }}
                className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left font-bold text-xs shadow-sm hover:border-[#febd69] transition-all"
              >
                💳 Top-up Pay (+$50)
                <span className="block text-[11px] font-normal text-neutral-500 mt-0.5">
                  Instant balance reload
                </span>
              </button>
            </div>

            {/* Orders Section */}
            <div id="orders-section">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Your Orders
                </h3>
                <span className="text-xs text-neutral-500">Past 30 days</span>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-neutral-900 rounded-xl p-3.5 shadow-sm border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2.5 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                          Order #{order.id}
                        </span>
                        <span className="font-bold text-neutral-700 dark:text-neutral-300">
                          {order.date}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                          Total
                        </span>
                        <span className="font-black text-neutral-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Status Progress Bar */}
                    <div className="mb-3 bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {order.estimatedDelivery}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {order.trackingNumber}
                        </span>
                      </div>

                      {/* 4-step progress dots */}
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full bg-emerald-500 transition-all ${
                            order.status === 'ordered'
                              ? 'w-1/4'
                              : order.status === 'shipped'
                              ? 'w-2/4'
                              : order.status === 'out_for_delivery'
                              ? 'w-3/4'
                              : 'w-full'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-neutral-400 mt-1">
                        <span>Ordered</span>
                        <span>Shipped</span>
                        <span>Out for Delivery</span>
                        <span>Delivered</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                            {item.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold truncate text-neutral-800 dark:text-neutral-200">
                              {item.title}
                            </h5>
                            <p className="text-[11px] text-neutral-500">
                              Qty: {item.quantity} • ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                      <button
                        onClick={() => {
                          playBiometricTickSound();
                          alert(`Tracking ${order.trackingNumber}:\nPackage is out for delivery with Amazon Logistics driver.`);
                        }}
                        className="flex-1 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-neutral-900 rounded-lg text-xs font-bold text-center"
                      >
                        Track Package
                      </button>
                      <button
                        onClick={() => {
                          playBiometricTickSound();
                          if (order.items[0]) {
                            const found = PRODUCTS.find((p) => p.title.includes(order.items[0].title)) || PRODUCTS[0];
                            addToCart(found);
                          }
                        }}
                        className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold hover:bg-neutral-200"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CART ================= */}
        {activeTab === 'cart' && (
          <div className="p-3 pb-28 animate-fade-in">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  🛒
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Your Amazon Cart is empty
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Check your Saved for later items or continue shopping for top tech and home deals.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="mt-4 px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-neutral-900 font-bold text-xs rounded-full shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                {/* Subtotal Banner & Checkout Call to action */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-3.5 shadow-sm border border-neutral-200 dark:border-neutral-800 mb-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                      Subtotal ({cart.filter((i) => i.selected).reduce((sum, i) => sum + i.quantity, 0)} items):
                    </span>
                    <span className="text-lg font-black text-neutral-900 dark:text-white">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your order qualifies for <strong>FREE Prime Delivery</strong></span>
                  </div>

                  <button
                    disabled={cartSubtotal === 0}
                    onClick={() => {
                      playBiometricTickSound();
                      setIsCheckoutOpen(true);
                      setCheckoutStep('review');
                    }}
                    className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] disabled:opacity-50 text-neutral-900 font-black text-xs rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    Proceed to Checkout ({cart.filter((i) => i.selected).length} items)
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-white dark:bg-neutral-900 rounded-xl p-3 shadow-sm border border-neutral-200 dark:border-neutral-800"
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItemSelection(item.product.id)}
                          className="mt-1 w-4 h-4 accent-[#e67a00] rounded cursor-pointer"
                        />

                        {/* Product Emoji Photo */}
                        <div
                          onClick={() => setSelectedProduct(item.product)}
                          className={`w-16 h-16 bg-gradient-to-br ${item.product.bgColor} rounded-lg flex items-center justify-center text-3xl flex-shrink-0 cursor-pointer`}
                        >
                          {item.product.imageEmoji}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => setSelectedProduct(item.product)}
                            className="text-xs font-bold leading-snug line-clamp-2 text-neutral-900 dark:text-neutral-100 hover:text-[#007185] cursor-pointer"
                          >
                            {item.product.title}
                          </h4>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-black text-neutral-900 dark:text-white">
                              ${item.product.price.toFixed(2)}
                            </span>
                            {item.product.originalPrice > item.product.price && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                ${item.product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            In Stock
                          </p>
                          {item.selectedColor && (
                            <p className="text-[10px] text-neutral-400">
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity adjustment & Delete */}
                      <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-neutral-700 shadow-xs hover:bg-neutral-200 text-neutral-800 dark:text-neutral-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-neutral-700 shadow-xs hover:bg-neutral-200 text-neutral-800 dark:text-neutral-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: MENU ================= */}
        {activeTab === 'menu' && (
          <div className="p-3 pb-24 animate-fade-in space-y-3">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Explore Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Prime Deals', icon: '⚡' },
                  { name: 'Electronics', icon: '🎧' },
                  { name: 'Home & Kitchen', icon: '🍳' },
                  { name: 'Fashion & Shoes', icon: '👟' },
                  { name: 'Amazon Devices', icon: '📱' },
                  { name: 'Books & Audible', icon: '📚' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(item.name.toLowerCase().includes('prime') ? 'deals' : 'all');
                      setActiveTab('home');
                    }}
                    className="p-2.5 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 rounded-lg text-left text-xs font-bold flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 shadow-sm border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
              <button
                onClick={() => {
                  alert('Amazon Customer Service: 24/7 Chat & Call Support available.');
                }}
                className="w-full py-2 text-left text-xs font-semibold flex items-center justify-between"
              >
                <span>Customer Service</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => setIsAddressSheetOpen(true)}
                className="w-full py-2 text-left text-xs font-semibold flex items-center justify-between"
              >
                <span>Manage Addresses</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => {
                  alert('Current Country & Language: United States (USD $) - English');
                }}
                className="w-full py-2 text-left text-xs font-semibold flex items-center justify-between"
              >
                <span>Language & Currency</span>
                <span className="text-xs text-neutral-400">🇺🇸 USD $</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-left text-xs font-bold text-red-600 flex items-center justify-between"
              >
                <span>Close Amazon</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= PRODUCT DETAIL MODAL ================= */}
      {selectedProduct && (
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 z-40 flex flex-col animate-slide-up overflow-hidden">
          {/* Top Bar with back button */}
          <div className="pt-11 px-3 pb-2 bg-[#131921] text-white flex items-center justify-between flex-shrink-0 shadow-md">
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1 -ml-1 text-white hover:text-[#febd69] flex items-center gap-1 font-bold text-xs"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playBiometricTickSound();
                  alert('Added to your Wish List!');
                }}
                className="p-1 hover:text-[#febd69]"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('cart');
                }}
                className="relative p-1 hover:text-[#febd69]"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff9900] text-black text-[9px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Product Page Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            {/* Brand & Title */}
            <div>
              <span className="text-xs font-bold text-[#007185] dark:text-cyan-400 uppercase tracking-wider">
                Visit the {selectedProduct.brand} Store
              </span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-1 leading-snug">
                {selectedProduct.title}
              </h2>

              {/* Reviews count & Badge */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(selectedProduct.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-300 text-neutral-300 dark:fill-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#007185] dark:text-cyan-400">
                  {selectedProduct.rating} ({selectedProduct.reviewsCount.toLocaleString()} ratings)
                </span>
              </div>
            </div>

            {/* Product Hero Image */}
            <div
              className={`w-full h-56 bg-gradient-to-br ${selectedProduct.bgColor} rounded-2xl flex items-center justify-center text-8xl shadow-inner relative`}
            >
              <span>{selectedProduct.imageEmoji}</span>
              {selectedProduct.badge && (
                <span className="absolute bottom-3 left-3 bg-[#131921] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Price & Savings Block */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2">
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-lg font-bold text-red-600">
                    -{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}%
                  </span>
                )}
                <span className="text-2xl font-black text-neutral-900 dark:text-white">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-neutral-400 line-through">
                    List Price: ${selectedProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {selectedProduct.prime && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium mt-1">
                  <span className="font-black text-[#00A8E1]">prime</span>
                  <span>FREE Delivery <strong>{selectedProduct.deliveryDate}</strong></span>
                </div>
              )}

              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                In Stock ({selectedProduct.inStockCount} available)
              </p>
            </div>

            {/* Color selector if applicable */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div>
                <span className="text-xs font-bold text-neutral-500 block mb-1.5">
                  Color Options:
                </span>
                <div className="flex items-center gap-2">
                  {selectedProduct.colors.map((c, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:border-[#febd69] focus:ring-2 focus:ring-[#febd69]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  playBiometricTickSound();
                  alert(`Added 1 "${selectedProduct.title}" to your cart!`);
                }}
                className="w-full py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-neutral-900 font-black text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setIsCheckoutOpen(true);
                  setCheckoutStep('review');
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-[#ffa41c] hover:bg-[#fa8900] text-neutral-900 font-black text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Buy Now
              </button>
            </div>

            {/* Features Bullet List */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
                About this item
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 list-disc pl-4">
                {selectedProduct.features.map((feat, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
                Technical Details
              </h4>
              <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 text-xs">
                {Object.entries(selectedProduct.specs).map(([k, v], idx) => (
                  <div
                    key={idx}
                    className={`flex px-3 py-2 ${
                      idx % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-950'
                    }`}
                  >
                    <span className="w-1/3 font-semibold text-neutral-500">{k}</span>
                    <span className="w-2/3 font-medium text-neutral-800 dark:text-neutral-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
                Customer Reviews
              </h4>
              <div className="space-y-3">
                {selectedProduct.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{rev.avatarEmoji}</span>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white leading-none">
                          {rev.author}
                        </p>
                        {rev.verified && (
                          <span className="text-[10px] text-[#c45500] font-bold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {rev.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {rev.body}
                    </p>
                    <div className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount} people found this helpful</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHECKOUT MODAL ================= */}
      {isCheckoutOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#131921] dark:text-white text-base">
                  amazon
                </span>
                <span className="text-xs font-bold bg-[#febd69] text-black px-1.5 rounded">
                  Checkout
                </span>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {checkoutStep === 'review' && (
                <>
                  {/* Shipping Address */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        Shipping to
                      </span>
                      <button
                        onClick={() => setIsAddressSheetOpen(true)}
                        className="text-xs text-[#007185] dark:text-cyan-400 font-bold"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">
                      Alex Doe
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      {selectedAddress}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      <Truck className="w-3.5 h-3.5" /> FREE Guaranteed Delivery Tomorrow
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Payment Method
                    </span>

                    <label
                      onClick={() => setSelectedPayment('amazon_pay')}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedPayment === 'amazon_pay'
                          ? 'border-[#ff9900] bg-amber-500/10'
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#ff9900]" />
                        <div>
                          <span className="text-xs font-bold block">
                            Amazon Pay Balance
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Available: ${amazonPayBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedPayment === 'amazon_pay'}
                        readOnly
                        className="accent-[#ff9900]"
                      />
                    </label>

                    <label
                      onClick={() => setSelectedPayment('visa')}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedPayment === 'visa'
                          ? 'border-[#ff9900] bg-amber-500/10'
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-xs font-bold block">
                            Prime Visa ending in 4242
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            5% back on this purchase
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedPayment === 'visa'}
                        readOnly
                        className="accent-[#ff9900]"
                      />
                    </label>

                    <label
                      onClick={() => setSelectedPayment('apple_pay')}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedPayment === 'apple_pay'
                          ? 'border-[#ff9900] bg-amber-500/10'
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black">Pay</span>
                        <div>
                          <span className="text-xs font-bold block">
                            Apple Pay
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Touch ID / Face ID
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedPayment === 'apple_pay'}
                        readOnly
                        className="accent-[#ff9900]"
                      />
                    </label>
                  </div>

                  {/* Order Summary Pricing */}
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping & handling:</span>
                      <span className="text-emerald-600 font-bold">$0.00 (Prime)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated tax to be collected:</span>
                      <span>${(cartSubtotal * 0.085).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-sm font-black text-neutral-900 dark:text-white">
                      <span>Order Total:</span>
                      <span className="text-red-600">
                        ${(cartSubtotal * 1.085).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-neutral-900 font-black text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Place your order in USD
                  </button>
                  <p className="text-[10px] text-center text-neutral-400">
                    By placing your order, you agree to Amazon's Conditions of Use and Privacy Notice.
                  </p>
                </>
              )}

              {checkoutStep === 'processing' && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Securing your order...
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Authorizing payment with Amazon Pay 1-Click
                  </p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-black text-neutral-900 dark:text-white">
                    Order Placed, Thanks!
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-xs mx-auto">
                    Confirmation has been sent to <strong>alex.doe@example.com</strong>. We'll notify you when your items ship.
                  </p>
                  <div className="pt-3 space-y-2">
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setActiveTab('you');
                      }}
                      className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-neutral-900 font-bold text-xs rounded-full shadow-sm"
                    >
                      Track My Orders
                    </button>
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setActiveTab('home');
                      }}
                      className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-full hover:bg-neutral-200"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADDRESS SELECTOR SHEET ================= */}
      {isAddressSheetOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-t-3xl p-4 shadow-2xl animate-slide-up space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h3 className="text-sm font-bold">Choose your delivery location</h3>
              <button onClick={() => setIsAddressSheetOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Alex Doe - Home', address: '742 Evergreen Terrace, Seattle, WA 98101', default: true },
                { name: 'Alex Doe - Office', address: '410 Terry Ave N, Seattle, WA 98109', default: false },
                { name: 'Amazon Hub Locker - Pine', address: 'Pine St & 5th Ave, Seattle, WA 98101', default: false }
              ].map((addr, i) => (
                <div
                  key={i}
                  onClick={() => {
                    playBiometricTickSound();
                    setSelectedAddress(`${addr.name} (${addr.address})`);
                    setIsAddressSheetOpen(false);
                  }}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-[#febd69] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold block text-neutral-900 dark:text-white">
                      {addr.name}
                    </span>
                    <span className="text-neutral-500 block">{addr.address}</span>
                  </div>
                  {selectedAddress.includes(addr.name) && (
                    <Check className="w-4 h-4 text-[#ff9900]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Amazon Tab Navigation Bar */}
      <div className="bg-white dark:bg-[#131921] border-t border-neutral-200 dark:border-neutral-800 py-1.5 px-3 flex items-center justify-around flex-shrink-0 z-30 shadow-lg">
        <button
          onClick={() => {
            playBiometricTickSound();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === 'home'
              ? 'text-[#007185] dark:text-[#febd69]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">
            🏠
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </button>

        <button
          onClick={() => {
            playBiometricTickSound();
            setActiveTab('you');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === 'you'
              ? 'text-[#007185] dark:text-[#febd69]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">You</span>
        </button>

        <button
          onClick={() => {
            playBiometricTickSound();
            setActiveTab('cart');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer relative transition-colors ${
            activeTab === 'cart'
              ? 'text-[#007185] dark:text-[#febd69]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#ff9900] text-black text-[9px] font-black rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
              {totalCartCount}
            </span>
          )}
          <span className="text-[10px] font-semibold tracking-tight">Cart</span>
        </button>

        <button
          onClick={() => {
            playBiometricTickSound();
            setActiveTab('menu');
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === 'menu'
              ? 'text-[#007185] dark:text-[#febd69]'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Menu</span>
        </button>
      </div>
    </div>
  );
};
