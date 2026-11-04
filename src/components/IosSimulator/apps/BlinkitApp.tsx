import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  X,
  CheckCircle,
  Phone,
  Share2,
  Sparkles,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  CreditCard,
  Zap,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulatorState, IosAppId } from '../../../types';
import { playBiometricTickSound, playSuccessChime, playVolumeStepSound } from '../../../utils/audioUtils';

interface ProductItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  discount: string;
  category: string;
  imageEmoji: string;
  deliveryMinutes: number;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'b1',
    name: 'Amul Taaza Homogenised Toned Milk',
    weight: '500 ml',
    price: 27,
    mrp: 29,
    discount: '7% OFF',
    category: 'dairy',
    imageEmoji: '🥛',
    deliveryMinutes: 8
  },
  {
    id: 'b2',
    name: 'Farm Fresh Hybrid Tomatoes',
    weight: '1 kg',
    price: 32,
    mrp: 45,
    discount: '28% OFF',
    category: 'produce',
    imageEmoji: '🍅',
    deliveryMinutes: 8
  },
  {
    id: 'b3',
    name: 'Farm Fresh Nasik Red Onions',
    weight: '1 kg',
    price: 38,
    mrp: 50,
    discount: '24% OFF',
    category: 'produce',
    imageEmoji: '🧅',
    deliveryMinutes: 9
  },
  {
    id: 'b4',
    name: 'Modern 100% Whole Wheat Bread',
    weight: '400 g',
    price: 45,
    mrp: 50,
    discount: '10% OFF',
    category: 'dairy',
    imageEmoji: '🍞',
    deliveryMinutes: 8
  },
  {
    id: 'b5',
    name: "Lay's India's Magic Masala Chips",
    weight: '50 g',
    price: 20,
    mrp: 20,
    discount: '',
    category: 'snacks',
    imageEmoji: '🥔',
    deliveryMinutes: 7
  },
  {
    id: 'b6',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    weight: 'Pack of 4 (280 g)',
    price: 56,
    mrp: 60,
    discount: '6% OFF',
    category: 'instant',
    imageEmoji: '🍜',
    deliveryMinutes: 7
  },
  {
    id: 'b7',
    name: 'Coca-Cola Zero Sugar Can',
    weight: '300 ml',
    price: 40,
    mrp: 40,
    discount: '',
    category: 'beverages',
    imageEmoji: '🥤',
    deliveryMinutes: 8
  },
  {
    id: 'b8',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    weight: '150 g',
    price: 165,
    mrp: 190,
    discount: '13% OFF',
    category: 'sweets',
    imageEmoji: '🍫',
    deliveryMinutes: 8
  },
  {
    id: 'b9',
    name: "Haldiram's Nagpur Aloo Bhujia",
    weight: '200 g',
    price: 58,
    mrp: 65,
    discount: '10% OFF',
    category: 'snacks',
    imageEmoji: '🥨',
    deliveryMinutes: 8
  },
  {
    id: 'b10',
    name: 'Nescafe Classic Instant Coffee Jar',
    weight: '50 g',
    price: 185,
    mrp: 210,
    discount: '12% OFF',
    category: 'beverages',
    imageEmoji: '☕',
    deliveryMinutes: 8
  },
  {
    id: 'b11',
    name: 'Fresh Shimla Royal Delicious Apples',
    weight: '4 pcs (~600 g)',
    price: 125,
    mrp: 160,
    discount: '22% OFF',
    category: 'produce',
    imageEmoji: '🍎',
    deliveryMinutes: 9
  },
  {
    id: 'b12',
    name: 'Epigamia Natural Greek Yogurt',
    weight: '100 g',
    price: 45,
    mrp: 50,
    discount: '10% OFF',
    category: 'dairy',
    imageEmoji: '🥣',
    deliveryMinutes: 8
  },
  {
    id: 'b13',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    weight: '1 Litre',
    price: 135,
    mrp: 160,
    discount: '15% OFF',
    category: 'instant',
    imageEmoji: '🛢️',
    deliveryMinutes: 10
  },
  {
    id: 'b14',
    name: 'Dettol Original Germ Protection Handwash',
    weight: '675 ml Refill',
    price: 99,
    mrp: 119,
    discount: '16% OFF',
    category: 'household',
    imageEmoji: '🧼',
    deliveryMinutes: 9
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🔥' },
  { id: 'dairy', label: 'Dairy & Bread', icon: '🥛' },
  { id: 'produce', label: 'Vegetables & Fruits', icon: '🥦' },
  { id: 'snacks', label: 'Snacks & Munchies', icon: '🍟' },
  { id: 'beverages', label: 'Drinks & Juices', icon: '🥤' },
  { id: 'instant', label: 'Instant Food', icon: '🍜' },
  { id: 'sweets', label: 'Chocolates & Sweets', icon: '🍫' },
  { id: 'household', label: 'Household Essentials', icon: '🧼' }
];

interface BlinkitAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp?: (app: IosAppId) => void;
  onClose: () => void;
}

export const BlinkitApp: React.FC<BlinkitAppProps> = ({ state, onUpdateState, onOpenApp, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({
    b1: 2, // 2 milk
    b5: 1  // 1 chips
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [activeOrder, setActiveOrder] = useState<{
    id: string;
    itemsCount: number;
    totalAmount: number;
    riderName: string;
    minutesLeft: number;
    status: 'packing' | 'picked' | 'on_way' | 'delivered';
  } | null>(null);

  // Live order countdown
  useEffect(() => {
    if (!activeOrder || activeOrder.minutesLeft <= 0) return;
    const interval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        if (prev.minutesLeft <= 1) {
          return { ...prev, minutesLeft: 0, status: 'delivered' };
        }
        const nextMin = prev.minutesLeft - 1;
        let nextStatus = prev.status;
        if (nextMin <= 6) nextStatus = 'on_way';
        else if (nextMin <= 8) nextStatus = 'picked';
        return { ...prev, minutesLeft: nextMin, status: nextStatus };
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  const addToCart = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playBiometricTickSound();
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playVolumeStepSound();
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const totalItemsCount: number = Object.values(cart).reduce<number>((a, b) => a + Number(b), 0);

  const cartItemsList: Array<ProductItem & { qty: number }> = Object.entries(cart)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([id, qty]) => {
      const prod = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
      return { ...prod, qty: Number(qty) };
    });

  const itemsTotal: number = cartItemsList.reduce<number>((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = itemsTotal >= 199 ? 0 : 15;
  const handlingFee = 4;
  const grandTotal = itemsTotal > 0 ? itemsTotal + deliveryFee + handlingFee : 0;

  const handlePlaceOrder = () => {
    if (totalItemsCount === 0 || isOrdering) return;
    setIsOrdering(true);
    playBiometricTickSound();

    setTimeout(() => {
      setIsOrdering(false);
      setIsCartOpen(false);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      playSuccessChime();

      setActiveOrder({
        id: `BLK-${Math.floor(100000 + Math.random() * 900000)}`,
        itemsCount: totalItemsCount,
        totalAmount: grandTotal,
        riderName: 'Rajesh Kumar (Hero EV ⚡)',
        minutesLeft: 9,
        status: 'packing'
      });

      // Clear cart
      setCart({});
    }, 1200);
  };

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="h-full flex flex-col bg-[#F4F6FB] select-none text-neutral-900 font-sans relative overflow-hidden">
      {/* BLINKIT BRANDED HEADER */}
      <div className="bg-[#F7D300] pt-12 pb-3 px-3 shadow-sm border-b border-amber-300">
        {/* Top Location & Delivery Time Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-black text-[#F7D300] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-[#F7D300]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-black text-sm tracking-tight text-neutral-900 uppercase">
                  10 Minutes
                </span>
                <span className="w-2 h-2 rounded-full bg-[#0C831F] animate-ping" />
              </div>
              <p className="text-[10px] text-neutral-800 font-medium truncate flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 inline shrink-0" />
                <span>Home • Koramangala 4th Block, Bengaluru</span>
              </p>
            </div>
          </div>

          {/* User Profile / Blinkit Cash */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2 py-1 rounded-full bg-black/10 border border-black/10 flex items-center gap-1 text-[10px] font-bold">
              <span>🪙</span>
              <span>₹150</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 text-neutral-800" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 'milk', 'chips', 'onion', 'bread'..."
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white text-xs text-neutral-900 placeholder-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-black/20 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES HORIZONTAL PILLS */}
      <div className="bg-white border-b border-neutral-200 px-3 py-2 overflow-x-auto flex gap-1.5 scrollbar-none shadow-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playBiometricTickSound();
              setActiveCategory(cat.id);
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#0C831F] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE DELIVERY STATUS BANNER (IF ACTIVE ORDER) */}
      {activeOrder && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-2.5 px-3 flex items-center justify-between cursor-pointer animate-fade-in shadow-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Truck className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold leading-none">
                {activeOrder.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${activeOrder.minutesLeft} mins`}
              </p>
              <p className="text-[10px] text-emerald-100">{activeOrder.riderName}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full">
            Track &gt;
          </span>
        </div>
      )}

      {/* MAIN PRODUCTS GRID SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
        {/* Promotional Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 p-3 flex items-center justify-between border border-amber-400 shadow-xs">
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded-md">
              Fastest in India
            </span>
            <h4 className="font-black text-sm text-neutral-900 mt-1">Superfast 10-Minute Grocery</h4>
            <p className="text-[10px] text-neutral-800">Fresh milk, hot munchies & cold beverages guaranteed.</p>
          </div>
          <div className="text-3xl">⚡🛍️</div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {activeCategory === 'all' ? 'Trending Groceries & Essentials' : CATEGORIES.find(c => c.id === activeCategory)?.label}
          </span>
          <span className="text-[10px] font-semibold text-[#0C831F]">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Product Cards Grid (2 cols) */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredProducts.map((prod) => {
            const countInCart = cart[prod.id] || 0;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-2.5 flex flex-col justify-between border border-neutral-200/80 shadow-xs hover:border-amber-300 transition-colors"
              >
                {/* Top Badge & Delivery Time */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-[#0C831F] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {prod.deliveryMinutes} MINS
                  </span>
                  {prod.discount && (
                    <span className="text-[8px] font-black bg-blue-50 text-blue-700 px-1 py-0.5 rounded-xs border border-blue-200">
                      {prod.discount}
                    </span>
                  )}
                </div>

                {/* Big Emoji / Product Visual */}
                <div className="flex items-center justify-center py-2 text-4xl">
                  {prod.imageEmoji}
                </div>

                {/* Product Name & Weight */}
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-neutral-900 line-clamp-2 leading-snug">
                    {prod.name}
                  </h5>
                  <p className="text-[10px] text-neutral-400 font-medium">{prod.weight}</p>
                </div>

                {/* Pricing & Add to Cart Stepper */}
                <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="font-black text-xs text-neutral-900">₹{prod.price}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-neutral-400 line-through ml-1">₹{prod.mrp}</span>
                    )}
                  </div>

                  {countInCart > 0 ? (
                    <div className="flex items-center bg-[#0C831F] text-white rounded-lg shadow-xs overflow-hidden">
                      <button
                        onClick={(e) => removeFromCart(prod.id, e)}
                        className="px-2 py-1 hover:bg-black/20 text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1 text-xs font-black">{countInCart}</span>
                      <button
                        onClick={(e) => addToCart(prod.id, e)}
                        className="px-2 py-1 hover:bg-black/20 text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => addToCart(prod.id, e)}
                      className="px-3 py-1 rounded-lg border-2 border-[#0C831F] text-[#0C831F] bg-emerald-50/50 hover:bg-[#0C831F] hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CART BAR (WHEN ITEMS IN CART) */}
      {totalItemsCount > 0 && !isCartOpen && (
        <div className="absolute bottom-3 left-3 right-3 z-30 animate-slide-up">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-[#0C831F] hover:bg-[#0a6d1a] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-emerald-400/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-xs tracking-tight uppercase">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} • ₹{itemsTotal}
                </p>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span>⚡ Delivery in 10 mins</span>
                  {deliveryFee === 0 && <span className="text-yellow-300 font-bold">• FREE Delivery</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-white text-[#0C831F] px-3 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* CART & CHECKOUT MODAL OVERLAY */}
      {isCartOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0C831F] text-white flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Your Blinkit Cart</h3>
                  <p className="text-[10px] text-neutral-500">Delivering to Home (Bengaluru)</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>

            {/* Scrollable Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Order Items ({totalItemsCount})</span>
              <div className="divide-y divide-neutral-100">
                {cartItemsList.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">{item.imageEmoji}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-neutral-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">{item.weight}</p>
                        <p className="text-xs font-black text-neutral-800">₹{item.price * item.qty}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-[#0C831F] text-white rounded-lg shadow-xs overflow-hidden shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-2 py-1 hover:bg-black/20 text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1 text-xs font-black">{item.qty}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="px-2 py-1 hover:bg-black/20 text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 space-y-1.5 text-xs">
                <span className="font-bold text-[11px] text-neutral-900">Bill Details</span>
                <div className="flex justify-between text-neutral-600">
                  <span>Items Total</span>
                  <span>₹{itemsTotal}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Handling & Packaging</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-black text-sm text-neutral-900">
                  <span>To Pay</span>
                  <span className="text-[#0C831F]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-bold text-neutral-900">Paytm UPI / Instant UPI</p>
                    <p className="text-[10px] text-neutral-500">Fast 1-Click biometric payment</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600">Linked</span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full py-3.5 rounded-2xl bg-[#0C831F] hover:bg-[#0a6d1a] disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                {isOrdering ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Pay ₹{grandTotal} • Place Order in 10 Mins</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE ORDER TRACKING MODAL */}
      {activeOrder && (
        <div className="absolute inset-0 z-40 bg-neutral-900/90 backdrop-blur-md flex flex-col text-white animate-fade-in p-4 pt-12 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F7D300] text-black font-black flex items-center justify-center text-xs">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-sm">Blinkit Live Tracking</h3>
                <p className="text-[10px] text-neutral-400">Order ID: {activeOrder.id}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveOrder(null)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 p-4 rounded-3xl bg-neutral-800 border border-white/10 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F7D300]">
              {activeOrder.status === 'delivered' ? 'COMPLETED' : 'ESTIMATED DELIVERY'}
            </span>
            <h2 className="text-3xl font-black text-white">
              {activeOrder.status === 'delivered' ? 'DELIVERED 🎉' : `${activeOrder.minutesLeft} MINS`}
            </h2>
            <p className="text-xs text-neutral-300">
              {activeOrder.status === 'delivered'
                ? 'Your order has been handed over. Enjoy your items!'
                : 'Delivery partner is on the way to your doorstep'}
            </p>
          </div>

          {/* Stepper Status */}
          <div className="bg-neutral-800/80 rounded-2xl p-4 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <div>
                <p className="font-bold">Order Confirmed</p>
                <p className="text-[10px] text-neutral-400">Blinkit Dark Store #42</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className={`w-4 h-4 shrink-0 ${activeOrder.status !== 'packing' ? 'text-green-400' : 'text-neutral-500'}`} />
              <div>
                <p className="font-bold">Packed with Ice & Seal</p>
                <p className="text-[10px] text-neutral-400">Quality check passed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className={`w-4 h-4 shrink-0 ${activeOrder.status === 'on_way' || activeOrder.status === 'delivered' ? 'text-green-400 animate-pulse' : 'text-neutral-500'}`} />
              <div>
                <p className="font-bold">Out for Delivery</p>
                <p className="text-[10px] text-neutral-400">{activeOrder.riderName}</p>
              </div>
            </div>
          </div>

          {/* Rider Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                if (onOpenApp) {
                  onUpdateState((s) => ({
                    ...s,
                    activeCall: {
                      inCall: true,
                      contactName: 'Rajesh Kumar (Blinkit Rider)',
                      contactNumber: '+91 98112 34567',
                      duration: 0,
                      isMuted: false,
                      isSpeaker: true,
                      status: 'connected'
                    }
                  }));
                  onOpenApp('phone');
                }
              }}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-green-400" />
              <span>Call Rajesh</span>
            </button>
            <button
              onClick={() => setActiveOrder(null)}
              className="flex-1 py-2.5 rounded-xl bg-[#0C831F] font-bold text-xs text-white flex items-center justify-center"
            >
              Order More Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
