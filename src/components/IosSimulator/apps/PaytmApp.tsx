import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Send,
  Building,
  CreditCard,
  Smartphone,
  Zap,
  Tv,
  Car,
  History,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  Share2,
  Download,
  Gift,
  BadgePercent,
  Lock,
  Wallet,
  HelpCircle,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulatorState, IosAppId } from '../../../types';
import { playSuccessChime, playBiometricTickSound, playDtmfTone } from '../../../utils/audioUtils';

interface PaytmAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp?: (app: IosAppId) => void;
  onClose: () => void;
}

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  category: 'transfer' | 'recharge' | 'bill' | 'cashback' | 'shopping';
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  time: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  upiRefId: string;
  paymentMethod: string;
}

interface ContactRecipient {
  name: string;
  phone: string;
  upiId: string;
  avatarBg: string;
  recent?: boolean;
}

const PRESET_CONTACTS: ContactRecipient[] = [
  { name: 'Rohan R. Potdar', phone: '+91 98765 43210', upiId: 'rohan.potdar@okaxis', avatarBg: 'bg-indigo-600', recent: true },
  { name: 'Sarah (Design Lead)', phone: '+91 98234 56789', upiId: 'sarah.design@paytm', avatarBg: 'bg-rose-500', recent: true },
  { name: 'Mom', phone: '+91 99887 66554', upiId: 'mom.home@sbi', avatarBg: 'bg-emerald-600', recent: true },
  { name: 'Sharma Kirana Store', phone: '+91 97112 34567', upiId: 'sharmakirana@paytm', avatarBg: 'bg-amber-600', recent: true },
  { name: 'Chai Point Corner', phone: '+91 91234 98765', upiId: 'chaipoint@icici', avatarBg: 'bg-teal-600', recent: true },
  { name: 'Landlord Sharma', phone: '+91 98451 12345', upiId: 'landlord.rent@hdfcbank', avatarBg: 'bg-blue-700' }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-984210',
    title: 'Starbucks Coffee',
    subtitle: 'Paid at Koramangala Cafe',
    category: 'shopping',
    amount: 350,
    type: 'debit',
    date: 'Today',
    time: '09:25 AM',
    status: 'SUCCESS',
    upiRefId: '426789123456',
    paymentMethod: 'Paytm UPI (SBI A/c ••4290)'
  },
  {
    id: 'TXN-984188',
    title: 'Salary Credit - Tech Corp',
    subtitle: 'Monthly Payroll Transfer',
    category: 'transfer',
    amount: 75000,
    type: 'credit',
    date: 'Yesterday',
    time: '06:30 PM',
    status: 'SUCCESS',
    upiRefId: '426781290345',
    paymentMethod: 'Direct Bank NEFT to SBI A/c ••4290'
  },
  {
    id: 'TXN-983940',
    title: 'Chai Point Corner',
    subtitle: 'Evening Ginger Tea & Samosa',
    category: 'shopping',
    amount: 55,
    type: 'debit',
    date: 'Yesterday',
    time: '04:15 PM',
    status: 'SUCCESS',
    upiRefId: '426779812450',
    paymentMethod: 'Paytm Wallet'
  },
  {
    id: 'TXN-983620',
    title: 'Cashback from Scratch Card',
    subtitle: 'Bill Pay Delight Offer',
    category: 'cashback',
    amount: 50,
    type: 'credit',
    date: '14 Sep',
    time: '11:10 AM',
    status: 'SUCCESS',
    upiRefId: '426765109283',
    paymentMethod: 'Paytm Cashback Rewards'
  },
  {
    id: 'TXN-982900',
    title: 'Jio Fiber Broadband',
    subtitle: 'Monthly High-Speed Plan',
    category: 'bill',
    amount: 1179,
    type: 'debit',
    date: '12 Sep',
    time: '08:45 AM',
    status: 'SUCCESS',
    upiRefId: '426743901234',
    paymentMethod: 'Paytm UPI (SBI A/c ••4290)'
  }
];

export const PaytmApp: React.FC<PaytmAppProps> = ({ state, onUpdateState, onOpenApp, onClose }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'passbook' | 'bills' | 'cashback'>('home');

  // Balances
  const [walletBalance, setWalletBalance] = useState<number>(4250.0);
  const [bankBalance, setBankBalance] = useState<number>(48920.0);
  const [showWalletBalance, setShowWalletBalance] = useState<boolean>(true);
  const [isUpiLiteEnabled, setIsUpiLiteEnabled] = useState<boolean>(true);

  // Soundbox
  const [soundboxEnabled, setSoundboxEnabled] = useState<boolean>(true);
  const [soundboxBanner, setSoundboxBanner] = useState<string | null>(null);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const [searchTxn, setSearchTxn] = useState('');

  // Modals
  const [activeModal, setActiveModal] = useState<
    'none' | 'scan_pay' | 'send_mobile' | 'bank_transfer' | 'add_money' | 'recharge' | 'my_qr' | 'scratch_card'
  >('none');

  // Send Money Form State
  const [targetContact, setTargetContact] = useState<ContactRecipient | null>(null);
  const [customPhone, setCustomPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [paymentSource, setPaymentSource] = useState<'wallet' | 'sbi' | 'lite'>('sbi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    recipient: string;
    amount: number;
    upiRefId: string;
    date: string;
    method: string;
  } | null>(null);

  // Add Money Form State
  const [addAmountInput, setAddAmountInput] = useState('500');

  // Recharge Form State
  const [rechargeNumber, setRechargeNumber] = useState('98765 43210');
  const [rechargeOperator, setRechargeOperator] = useState<'Jio' | 'Airtel' | 'Vi'>('Jio');
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(299);

  // QR Scanner Simulation State
  const [scannedMerchant, setScannedMerchant] = useState<{ name: string; upiId: string; defaultAmount?: number } | null>(null);

  // Scratch Cards State
  const [unopenedScratchCards, setUnopenedScratchCards] = useState([
    { id: 'sc-1', title: 'Weekend UPI Bonus', prize: 35, scratched: false },
    { id: 'sc-2', title: 'Merchant QR Scan Treat', prize: 50, scratched: false },
    { id: 'sc-3', title: 'Paytm Gold Cashback', prize: 20, scratched: false }
  ]);
  const [activeScratch, setActiveScratch] = useState<{ id: string; title: string; prize: number; scratched: boolean } | null>(null);

  const [copiedUpi, setCopiedUpi] = useState(false);

  // Trigger Paytm Soundbox Voice Announcement
  const triggerSoundbox = (amount: number, recipientName?: string) => {
    if (!soundboxEnabled) return;
    const msg = `Payment of ₹${amount} successful on Paytm!`;
    setSoundboxBanner(`🔊 Paytm Soundbox: "Paytm par ₹${amount} prapt hue"`);
    setTimeout(() => setSoundboxBanner(null), 5000);

    // Speak using browser SpeechSynthesis if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(`Payment of ${amount} rupees received on Paytm`);
        utter.lang = 'en-IN';
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        // Audio fallback
      }
    }
    playSuccessChime();
  };

  // Complete Payment Action
  const handleExecutePayment = (
    recipientTitle: string,
    recipientSubtitle: string,
    amountNum: number,
    category: 'transfer' | 'recharge' | 'bill' | 'shopping',
    methodName: string
  ) => {
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsProcessingPayment(true);
    playBiometricTickSound();

    setTimeout(() => {
      setIsProcessingPayment(false);
      const newRef = '4267' + Math.floor(10000000 + Math.random() * 90000000);
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        title: recipientTitle,
        subtitle: recipientSubtitle,
        category,
        amount: amountNum,
        type: 'debit',
        date: 'Today',
        time: 'Just now',
        status: 'SUCCESS',
        upiRefId: newRef,
        paymentMethod: methodName
      };

      // Deduct from chosen balance
      if (paymentSource === 'wallet') {
        setWalletBalance((prev) => Math.max(0, prev - amountNum));
      } else {
        setBankBalance((prev) => Math.max(0, prev - amountNum));
      }

      setTransactions((prev) => [newTxn, ...prev]);
      setPaymentSuccessData({
        recipient: recipientTitle,
        amount: amountNum,
        upiRefId: newRef,
        date: 'Today, Just now',
        method: methodName
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      triggerSoundbox(amountNum, recipientTitle);
    }, 1200);
  };

  // Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard?.writeText?.('vishnu@paytm');
    setCopiedUpi(true);
    playBiometricTickSound();
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#F4F6F9] text-neutral-900 select-none font-sans relative overflow-hidden">
      {/* Soundbox Real-Time Announcement Toast */}
      {soundboxBanner && (
        <div className="absolute top-12 left-3 right-3 z-50 bg-[#002E6E] text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-cyan-400 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Volume2 className="w-4 h-4 text-[#00BAF2] shrink-0" />
            <span className="truncate">{soundboxBanner}</span>
          </div>
          <button onClick={() => setSoundboxBanner(null)} className="text-white/70 hover:text-white p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP STATUS BAR & PAYTM NAV HEADER */}
      <div className="bg-[#002E6E] text-white pt-12 pb-3 px-3.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          {/* User Profile Avatar & KYC Verification */}
          <div
            onClick={() => setActiveModal('my_qr')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00BAF2] to-blue-400 flex items-center justify-center font-bold text-sm text-white shadow-sm border border-white/30">
                V
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border border-[#002E6E]">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold leading-tight">Vishnu Sai</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-semibold px-1 rounded-sm">KYC</span>
              </div>
              <span className="text-[10px] text-white/70 flex items-center gap-1">
                vishnu@paytm
                <QrCode className="w-2.5 h-2.5 text-[#00BAF2]" />
              </span>
            </div>
          </div>

          {/* Quick Header Icons */}
          <div className="flex items-center gap-1.5">
            {/* Soundbox Toggle Button */}
            <button
              onClick={() => {
                setSoundboxEnabled(!soundboxEnabled);
                playBiometricTickSound();
              }}
              title={soundboxEnabled ? 'Soundbox Enabled' : 'Soundbox Muted'}
              className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                soundboxEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  : 'bg-white/10 text-white/50 border-white/10'
              }`}
            >
              {soundboxEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>Soundbox</span>
            </button>

            {/* QR Scanner header button */}
            <button
              onClick={() => setActiveModal('scan_pay')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 shadow-xs cursor-pointer"
              title="Scan Any QR"
            >
              <QrCode className="w-4 h-4 text-[#00BAF2]" />
            </button>

            {/* Help / Support icon */}
            <button
              onClick={() => {
                setSoundboxBanner('24x7 Paytm Care & Security is active. All payments are encrypted.');
                setTimeout(() => setSoundboxBanner(null), 4000);
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 shadow-xs cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>

        {/* Search Bar / Quick Action Input */}
        <div
          onClick={() => setActiveModal('send_mobile')}
          className="mt-3 bg-white/15 hover:bg-white/20 border border-white/20 rounded-2xl px-3 py-2 flex items-center justify-between text-white/75 text-xs cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>Search &quot;Pay Rohan&quot;, Mobile, Electricity...</span>
          </div>
          <span className="text-[10px] text-[#00BAF2] font-semibold">Pay UPI</span>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pb-16 space-y-3.5">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="p-3.5 space-y-3.5">
            {/* 4 CORE UPI TRANSFER TILES (Official Paytm Style) */}
            <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-200/80">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-neutral-100">
                <span className="text-xs font-black text-neutral-800 tracking-tight">UPI Money Transfer</span>
                <span className="text-[10px] font-bold text-[#002E6E] flex items-center gap-0.5">
                  Powered by <span className="text-[#00BAF2]">Paytm UPI</span>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {/* 1. Scan & Pay */}
                <div
                  onClick={() => setActiveModal('scan_pay')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#002E6E] to-[#00BAF2] text-white flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 leading-tight">Scan &amp; Pay</span>
                </div>

                {/* 2. To Mobile or Contact */}
                <div
                  onClick={() => setActiveModal('send_mobile')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002E6E] border border-blue-200 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                    <Smartphone className="w-6 h-6 text-[#002E6E]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 leading-tight">To Mobile / Contact</span>
                </div>

                {/* 3. To Bank / Self */}
                <div
                  onClick={() => setActiveModal('bank_transfer')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002E6E] border border-blue-200 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                    <Building className="w-6 h-6 text-[#002E6E]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 leading-tight">To Bank A/c</span>
                </div>

                {/* 4. Balance & History */}
                <div
                  onClick={() => setActiveTab('passbook')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002E6E] border border-blue-200 flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                    <History className="w-6 h-6 text-[#002E6E]" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 leading-tight">Balance &amp; History</span>
                </div>
              </div>

              {/* UPI ID quick copy bar */}
              <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] bg-neutral-50 px-2.5 py-1.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <span className="font-semibold text-neutral-800">My UPI ID:</span>
                  <span className="font-mono text-neutral-700">vishnu@paytm</span>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="text-[11px] font-bold text-[#002E6E] hover:text-[#00BAF2] flex items-center gap-1 cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* PAYTM WALLET & BANK BALANCE CARD */}
            <div className="bg-gradient-to-br from-[#002E6E] via-[#003882] to-[#0F4A8A] text-white rounded-3xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#00BAF2]" />
                  <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Paytm Wallet &amp; UPI</span>
                </div>
                <button
                  onClick={() => setShowWalletBalance(!showWalletBalance)}
                  className="text-white/70 hover:text-white flex items-center gap-1 text-[11px] font-medium"
                >
                  {showWalletBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showWalletBalance ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-white/70 block">Total Available Balance</span>
                  <p className="text-2xl font-black font-mono tracking-tight text-white">
                    {showWalletBalance ? `₹${(walletBalance + bankBalance).toLocaleString('en-IN')}.00` : '₹ ••••••'}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveModal('add_money')}
                    className="px-3 py-1.5 rounded-full bg-[#00BAF2] hover:bg-cyan-400 text-[#002E6E] font-black text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Money</span>
                  </button>
                  <button
                    onClick={() => setActiveModal('send_mobile')}
                    className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 active:scale-95 transition-transform cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              </div>

              {/* Sub-account breakdown */}
              <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/10 rounded-xl p-2">
                  <span className="text-[10px] text-white/60 block">Paytm Wallet</span>
                  <span className="font-bold text-white font-mono">
                    {showWalletBalance ? `₹${walletBalance.toLocaleString('en-IN')}` : '₹••••'}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-2">
                  <span className="text-[10px] text-white/60 block">SBI Bank (••4290)</span>
                  <span className="font-bold text-white font-mono">
                    {showWalletBalance ? `₹${bankBalance.toLocaleString('en-IN')}` : '₹••••'}
                  </span>
                </div>
              </div>

              {/* UPI Lite Chip */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-white/80">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>UPI Lite (Fast PIN-less payments up to ₹500)</span>
                </div>
                <button
                  onClick={() => setIsUpiLiteEnabled(!isUpiLiteEnabled)}
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isUpiLiteEnabled ? 'bg-emerald-400' : 'bg-neutral-600'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      isUpiLiteEnabled ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* RECHARGES & BILL PAYMENTS */}
            <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-800">Recharge &amp; Bill Payments</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant &amp; Assured
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div
                  onClick={() => setActiveModal('recharge')}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">Mobile Recharge</span>
                </div>

                <div
                  onClick={() => {
                    handleExecutePayment('Tata Power Electricity', 'Consumer ID #982341', 850, 'bill', 'Paytm UPI (SBI A/c)');
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">Electricity</span>
                </div>

                <div
                  onClick={() => {
                    handleExecutePayment('Tata Play DTH', 'Subscriber ID #10029384', 399, 'bill', 'Paytm Wallet');
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Tv className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">DTH / Cable</span>
                </div>

                <div
                  onClick={() => {
                    handleExecutePayment('FASTag Recharge', 'Vehicle KA-01-MJ-2024', 500, 'bill', 'Paytm UPI (SBI A/c)');
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center group-active:scale-95 transition-transform">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 leading-tight">FASTag Toll</span>
                </div>
              </div>
            </div>

            {/* CASHBACK & REWARDS BANNER (SCRATCH CARDS) */}
            <div
              onClick={() => setActiveTab('cashback')}
              className="rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 p-3.5 text-white shadow-md flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black">Paytm Cashback &amp; Offers</span>
                    <span className="bg-white text-orange-600 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                      3 Pending
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-100">Tap to scratch cards &amp; win instant wallet cash</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
            </div>

            {/* RECENT TRANSACTIONS PREVIEW */}
            <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-800">Recent Transactions</span>
                <button
                  onClick={() => setActiveTab('passbook')}
                  className="text-[11px] font-bold text-[#002E6E] hover:text-[#00BAF2] cursor-pointer"
                >
                  View All &gt;
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {transactions.slice(0, 4).map((txn) => (
                  <div
                    key={txn.id}
                    onClick={() => setSelectedReceipt(txn)}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 px-1 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          txn.type === 'credit'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-50 text-[#002E6E]'
                        }`}
                      >
                        {txn.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-800 truncate max-w-[150px]">{txn.title}</p>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">{txn.date} • {txn.time}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black font-mono ${
                          txn.type === 'credit' ? 'text-emerald-600' : 'text-neutral-900'
                        }`}
                      >
                        {txn.type === 'credit' ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                      </span>
                      <span className="text-[9px] text-neutral-400 block">{txn.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASSBOOK / BALANCE & HISTORY */}
        {activeTab === 'passbook' && (
          <div className="p-3.5 space-y-3.5">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-neutral-900">Passbook &amp; Account Statement</h2>
                  <p className="text-[10px] text-neutral-500">Live statements &amp; payments history</p>
                </div>
                <button
                  onClick={() => setActiveModal('add_money')}
                  className="px-3 py-1 rounded-full bg-[#002E6E] text-white font-bold text-xs hover:bg-blue-900 cursor-pointer"
                >
                  + Add Money
                </button>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 bg-neutral-100 p-1 rounded-2xl text-[11px] font-bold">
                <button
                  onClick={() => setTransactionFilter('all')}
                  className={`flex-1 py-1 rounded-xl transition-colors cursor-pointer ${
                    transactionFilter === 'all' ? 'bg-white shadow-xs text-[#002E6E]' : 'text-neutral-500'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  onClick={() => setTransactionFilter('debit')}
                  className={`flex-1 py-1 rounded-xl transition-colors cursor-pointer ${
                    transactionFilter === 'debit' ? 'bg-white shadow-xs text-rose-600' : 'text-neutral-500'
                  }`}
                >
                  Paid Out
                </button>
                <button
                  onClick={() => setTransactionFilter('credit')}
                  className={`flex-1 py-1 rounded-xl transition-colors cursor-pointer ${
                    transactionFilter === 'credit' ? 'bg-white shadow-xs text-emerald-600' : 'text-neutral-500'
                  }`}
                >
                  Received
                </button>
              </div>

              {/* Search in Transactions */}
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name, UPI Ref, or amount..."
                  value={searchTxn}
                  onChange={(e) => setSearchTxn(e.target.value)}
                  className="w-full bg-transparent outline-none text-neutral-800 placeholder-neutral-400"
                />
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-neutral-100 pt-1">
                {transactions
                  .filter((t) => {
                    if (transactionFilter === 'debit') return t.type === 'debit';
                    if (transactionFilter === 'credit') return t.type === 'credit';
                    return true;
                  })
                  .filter((t) => {
                    if (!searchTxn) return true;
                    return (
                      t.title.toLowerCase().includes(searchTxn.toLowerCase()) ||
                      t.subtitle.toLowerCase().includes(searchTxn.toLowerCase()) ||
                      t.upiRefId.includes(searchTxn) ||
                      String(t.amount).includes(searchTxn)
                    );
                  })
                  .map((txn) => (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedReceipt(txn)}
                      className="py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-50 px-1 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            txn.type === 'credit'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-50 text-[#002E6E]'
                          }`}
                        >
                          {txn.type === 'credit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-rose-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate max-w-[150px]">{txn.title}</p>
                          <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">{txn.subtitle}</p>
                          <p className="text-[9px] text-neutral-400 font-mono">UPI Ref: {txn.upiRefId}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-sm font-black font-mono ${
                            txn.type === 'credit' ? 'text-emerald-600' : 'text-neutral-900'
                          }`}
                        >
                          {txn.type === 'credit' ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                        </span>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                            SUCCESS
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BILLS & RECHARGES FULL CATALOG */}
        {activeTab === 'bills' && (
          <div className="p-3.5 space-y-3.5">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-4">
              <div>
                <h2 className="text-sm font-black text-neutral-900">All Recharges &amp; Utilities</h2>
                <p className="text-[10px] text-neutral-500">Fast 1-tap bill payments with instant soundbox alerts</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <button
                  onClick={() => setActiveModal('recharge')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-bold text-neutral-800">Prepaid Mobile</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('Electricity - Adani Power', 'Account #9812450', 1240, 'bill', 'SBI UPI')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-6 h-6 text-amber-600" />
                  <span className="text-xs font-bold text-neutral-800">Electricity</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('FASTag Toll Pass', 'Vehicle KA-04-E-1009', 500, 'bill', 'Paytm Wallet')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Car className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-bold text-neutral-800">FASTag</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('Tata Play HD Pack', 'ID #40091823', 299, 'bill', 'SBI UPI')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Tv className="w-6 h-6 text-sky-600" />
                  <span className="text-xs font-bold text-neutral-800">DTH TV</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('Indane Gas Cylinder', 'LPG ID #2001923', 890, 'bill', 'SBI UPI')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-6 h-6 text-rose-600" />
                  <span className="text-xs font-bold text-neutral-800">Gas Cylinder</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('Namma Metro Smart Card', 'Card #88992211', 200, 'bill', 'Paytm Wallet')}
                  className="p-3 rounded-2xl bg-neutral-50 hover:bg-blue-50 border border-neutral-100 flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-6 h-6 text-[#002E6E]" />
                  <span className="text-xs font-bold text-neutral-800">Metro Card</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CASHBACK & SCRATCH CARDS */}
        {activeTab === 'cashback' && (
          <div className="p-3.5 space-y-3.5">
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-3xl p-4 text-white shadow-md">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                Paytm Rewards
              </span>
              <h2 className="text-xl font-black mt-2 leading-tight">Total Cashback Won: ₹450</h2>
              <p className="text-xs text-amber-100 mt-0.5">Credited directly to your Paytm Wallet!</p>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200/80 space-y-3">
              <span className="text-xs font-black text-neutral-800">Unopened Scratch Cards ({unopenedScratchCards.filter(s => !s.scratched).length})</span>
              <div className="grid grid-cols-2 gap-3">
                {unopenedScratchCards.map((sc) => (
                  <div
                    key={sc.id}
                    onClick={() => {
                      if (!sc.scratched) {
                        setActiveScratch(sc);
                      }
                    }}
                    className={`h-36 rounded-2xl p-3 flex flex-col justify-between border cursor-pointer relative overflow-hidden transition-transform hover:scale-102 ${
                      sc.scratched
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-gradient-to-br from-[#002E6E] to-[#00BAF2] text-white shadow-md'
                    }`}
                  >
                    {sc.scratched ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                        <span className="text-[11px] font-bold">Won ₹{sc.prize}</span>
                        <span className="text-[9px] text-emerald-600">Added to Wallet</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <Gift className="w-5 h-5 text-amber-300" />
                          <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md">TAP</span>
                        </div>
                        <div>
                          <p className="text-xs font-black leading-snug">{sc.title}</p>
                          <p className="text-[10px] text-cyan-200">Tap to Scratch</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM PAYTM NAVIGATION BAR */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-neutral-200 px-3 py-1.5 flex items-center justify-around z-30 shadow-lg">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'home' ? 'text-[#002E6E] font-black' : 'text-neutral-400 font-semibold'
          }`}
        >
          <Building className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Passbook */}
        <button
          onClick={() => setActiveTab('passbook')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'passbook' ? 'text-[#002E6E] font-black' : 'text-neutral-400 font-semibold'
          }`}
        >
          <History className="w-4 h-4" />
          <span className="text-[10px]">Passbook</span>
        </button>

        {/* Center Prominent QR Scanner Button */}
        <button
          onClick={() => setActiveModal('scan_pay')}
          className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-[#002E6E] via-[#003882] to-[#00BAF2] text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-transform cursor-pointer"
          title="Scan Any QR"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>

        {/* Bills */}
        <button
          onClick={() => setActiveTab('bills')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'bills' ? 'text-[#002E6E] font-black' : 'text-neutral-400 font-semibold'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px]">Bills</span>
        </button>

        {/* Cashback */}
        <button
          onClick={() => setActiveTab('cashback')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'cashback' ? 'text-[#002E6E] font-black' : 'text-neutral-400 font-semibold'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span className="text-[10px]">Cashback</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SCAN ANY QR / QR SCANNER SIMULATOR */}
      {/* ========================================================================= */}
      {activeModal === 'scan_pay' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col pt-12 text-white animate-fade-in">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
            <button
              onClick={() => {
                setActiveModal('none');
                setScannedMerchant(null);
              }}
              className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold text-center">Scan Any UPI QR Code</span>
            <div className="w-6" />
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-between overflow-y-auto">
            {/* Viewfinder Target */}
            <div className="w-56 h-56 rounded-3xl border-2 border-[#00BAF2] relative flex flex-col items-center justify-center p-4 bg-neutral-900/60 shadow-2xl overflow-hidden mt-2">
              {/* Laser animation bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00BAF2] to-transparent shadow-[0_0_12px_#00BAF2] animate-pulse" />
              <QrCode className="w-24 h-24 text-white/30" />
              <p className="text-[11px] text-neutral-300 text-center font-medium mt-2">
                Align QR Code inside this square
              </p>
            </div>

            {/* Quick Demo QR Presets */}
            <div className="w-full space-y-2 mt-4">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide block text-center">
                Tap to Simulate Merchant QR:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Chai Point Corner', upiId: 'chaipoint@icici', defaultAmount: 40 },
                  { name: 'Starbucks Coffee', upiId: 'starbucks.retail@hdfcbank', defaultAmount: 320 },
                  { name: 'Sharma Kirana Store', upiId: 'sharmakirana@paytm', defaultAmount: 450 },
                  { name: 'Auto Rickshaw (Ramesh)', upiId: 'ramesh.auto@paytm', defaultAmount: 85 }
                ].map((m) => (
                  <button
                    key={m.name}
                    onClick={() => {
                      setTargetContact({
                        name: m.name,
                        phone: '+91 99000 11223',
                        upiId: m.upiId,
                        avatarBg: 'bg-[#002E6E]'
                      });
                      setTransferAmount(String(m.defaultAmount));
                      setTransferNote('Merchant QR Payment');
                      setActiveModal('send_mobile');
                    }}
                    className="p-2.5 rounded-2xl bg-neutral-800/90 hover:bg-[#002E6E] border border-white/10 text-left transition-colors cursor-pointer"
                  >
                    <p className="font-bold text-xs text-white truncate">{m.name}</p>
                    <p className="text-[10px] text-cyan-300 font-mono">₹{m.defaultAmount} • Tap to Pay</p>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-white/50 text-center mt-2 pb-2">
              Works with PhonePe, Google Pay, BharatPe &amp; Paytm QR
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SEND TO MOBILE / CONTACT */}
      {/* ========================================================================= */}
      {activeModal === 'send_mobile' && (
        <div className="absolute inset-0 bg-[#F4F6F9] z-40 flex flex-col pt-12 text-neutral-900 animate-fade-in">
          <div className="bg-[#002E6E] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <button
              onClick={() => {
                setActiveModal('none');
                setTargetContact(null);
                setTransferAmount('');
              }}
              className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold">Pay to Mobile or Contact</span>
            <div className="w-6" />
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* If contact is selected */}
            {targetContact ? (
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${targetContact.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                      {targetContact.name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-neutral-900 leading-tight">{targetContact.name}</h3>
                      <p className="text-[10px] text-neutral-500 font-mono">{targetContact.phone}</p>
                      <span className="text-[9px] text-[#002E6E] font-semibold">{targetContact.upiId}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setTargetContact(null)}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500">Enter Amount (₹)</label>
                  <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-300 rounded-2xl px-3 py-2">
                    <span className="text-xl font-black text-neutral-800">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full text-2xl font-black font-mono bg-transparent outline-none text-neutral-900"
                    />
                  </div>
                </div>

                {/* Quick chip amounts */}
                <div className="flex gap-2">
                  {['100', '250', '500', '1000'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTransferAmount(amt)}
                      className="flex-1 py-1 rounded-full bg-neutral-100 hover:bg-blue-100 text-neutral-700 text-xs font-bold border border-neutral-200 transition-colors cursor-pointer"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                {/* Note */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500">Add a message / note (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lunch split, chai, rent"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                {/* Payment Source Selection */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-neutral-500">Pay From Account:</label>
                  <div className="space-y-1.5">
                    <label
                      onClick={() => setPaymentSource('sbi')}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer text-xs ${
                        paymentSource === 'sbi' ? 'border-[#002E6E] bg-blue-50/50 font-bold' : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#002E6E]" />
                        <span>State Bank of India (••4290)</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">₹{bankBalance.toLocaleString('en-IN')}</span>
                    </label>

                    <label
                      onClick={() => setPaymentSource('wallet')}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer text-xs ${
                        paymentSource === 'wallet' ? 'border-[#002E6E] bg-blue-50/50 font-bold' : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#00BAF2]" />
                        <span>Paytm Wallet</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">₹{walletBalance.toLocaleString('en-IN')}</span>
                    </label>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  disabled={isProcessingPayment || !transferAmount || Number(transferAmount) <= 0}
                  onClick={() => {
                    handleExecutePayment(
                      targetContact.name,
                      `Paid to ${targetContact.phone}`,
                      Number(transferAmount),
                      'transfer',
                      paymentSource === 'wallet' ? 'Paytm Wallet' : 'SBI Bank UPI (••4290)'
                    );
                  }}
                  className="w-full py-3 rounded-2xl bg-[#002E6E] hover:bg-blue-900 disabled:bg-neutral-300 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <span>Verifying UPI PIN &amp; Paying...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{transferAmount || '0'} Securely</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Contact Selection List */
              <div className="space-y-3">
                {/* Search / Enter Phone */}
                <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-neutral-200 flex items-center gap-2">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Enter 10-digit mobile number or name"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full text-xs outline-none font-medium"
                  />
                  {customPhone && (
                    <button
                      onClick={() => {
                        setTargetContact({
                          name: `Recipient (${customPhone})`,
                          phone: customPhone,
                          upiId: `${customPhone.replace(/\D/g, '')}@paytm`,
                          avatarBg: 'bg-indigo-600'
                        });
                      }}
                      className="px-3 py-1 rounded-xl bg-[#002E6E] text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Proceed
                    </button>
                  )}
                </div>

                {/* Recent Contacts */}
                <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-neutral-200 space-y-2">
                  <span className="text-xs font-black text-neutral-800">Recent UPI Contacts</span>
                  <div className="divide-y divide-neutral-100">
                    {PRESET_CONTACTS.map((c) => (
                      <div
                        key={c.phone}
                        onClick={() => setTargetContact(c)}
                        className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 px-1 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full ${c.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                            {c.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{c.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">{c.phone}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#002E6E] bg-blue-50 px-2.5 py-1 rounded-full">
                          Pay
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD MONEY TO PAYTM WALLET */}
      {/* ========================================================================= */}
      {activeModal === 'add_money' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-40 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-t-3xl p-4 space-y-4 text-neutral-900 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00BAF2]" />
                <h3 className="font-black text-sm text-neutral-900">Add Money to Paytm Wallet</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-500">Amount to Add (₹)</span>
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-300 rounded-2xl px-3 py-2 mt-1">
                <span className="text-2xl font-black text-neutral-800">₹</span>
                <input
                  type="number"
                  value={addAmountInput}
                  onChange={(e) => setAddAmountInput(e.target.value)}
                  className="w-full text-2xl font-black font-mono bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2">
              {['200', '500', '1000', '2000'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setAddAmountInput(chip)}
                  className="flex-1 py-1.5 rounded-xl bg-neutral-100 hover:bg-blue-100 text-neutral-800 font-bold text-xs border border-neutral-200 transition-colors cursor-pointer"
                >
                  +₹{chip}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-neutral-500 leading-snug">
              Instant load via State Bank of India (••4290). No charges or fees apply.
            </p>

            <button
              onClick={() => {
                const addNum = Number(addAmountInput) || 500;
                setWalletBalance((prev) => prev + addNum);
                setTransactions((prev) => [
                  {
                    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                    title: 'Money Added to Wallet',
                    subtitle: 'Loaded via SBI Netbanking',
                    category: 'transfer',
                    amount: addNum,
                    type: 'credit',
                    date: 'Today',
                    time: 'Just now',
                    status: 'SUCCESS',
                    upiRefId: '4267' + Math.floor(10000000 + Math.random() * 90000000),
                    paymentMethod: 'SBI Netbanking'
                  },
                  ...prev
                ]);
                setActiveModal('none');
                confetti({ particleCount: 50, spread: 50 });
                triggerSoundbox(addNum, 'Wallet Topup');
              }}
              className="w-full py-3 rounded-2xl bg-[#002E6E] hover:bg-blue-900 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Add ₹{addAmountInput || '0'} to Wallet
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MOBILE RECHARGE FLOW */}
      {/* ========================================================================= */}
      {activeModal === 'recharge' && (
        <div className="absolute inset-0 bg-[#F4F6F9] z-40 flex flex-col pt-12 text-neutral-900 animate-fade-in">
          <div className="bg-[#002E6E] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <button
              onClick={() => setActiveModal('none')}
              className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold">Prepaid Mobile Recharge</span>
            <div className="w-6" />
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-neutral-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-500">Mobile Number</label>
                <input
                  type="text"
                  value={rechargeNumber}
                  onChange={(e) => setRechargeNumber(e.target.value)}
                  className="w-full text-sm font-bold bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 outline-none mt-1"
                />
              </div>

              {/* Operator */}
              <div>
                <label className="text-[11px] font-bold text-neutral-500">Select Operator</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['Jio', 'Airtel', 'Vi'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setRechargeOperator(op)}
                      className={`py-2 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                        rechargeOperator === op ? 'bg-[#002E6E] text-white border-[#002E6E]' : 'bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Plans */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-black text-neutral-800">Popular Recharge Packs</span>
                {[
                  { amt: 299, validity: '28 Days', data: '1.5 GB / Day', calls: 'Truly Unlimited Voice' },
                  { amt: 666, validity: '84 Days', data: '1.5 GB / Day', calls: 'Truly Unlimited Voice' },
                  { amt: 199, validity: '24 Days', data: '1 GB / Day', calls: 'Unlimited Calls' }
                ].map((plan) => (
                  <div
                    key={plan.amt}
                    onClick={() => setSelectedPlanAmount(plan.amt)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedPlanAmount === plan.amt
                        ? 'border-[#002E6E] bg-blue-50/60 shadow-xs'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-neutral-900 font-mono">₹{plan.amt}</span>
                      <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                        {plan.validity}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-medium mt-1">{plan.data} • {plan.calls}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  handleExecutePayment(
                    `${rechargeOperator} Prepaid Recharge`,
                    `Recharge for ${rechargeNumber}`,
                    selectedPlanAmount,
                    'recharge',
                    'Paytm UPI (SBI A/c)'
                  );
                }}
                className="w-full py-3 rounded-2xl bg-[#002E6E] hover:bg-blue-900 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Recharge ₹{selectedPlanAmount} Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: MY QR CODE */}
      {/* ========================================================================= */}
      {activeModal === 'my_qr' && (
        <div className="absolute inset-0 bg-[#002E6E] z-40 flex flex-col pt-12 text-white animate-fade-in">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/15">
            <button onClick={() => setActiveModal('none')} className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold">My Personal Paytm QR</span>
            <div className="w-6" />
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-white text-neutral-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center max-w-[260px] border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-[#002E6E] text-[#00BAF2] font-black flex items-center justify-center text-lg mb-2 shadow-sm">
                V
              </div>
              <h3 className="font-black text-sm text-neutral-900">Vishnu Sai</h3>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">vishnu@paytm</p>

              {/* QR Code Container */}
              <div className="w-44 h-44 rounded-2xl bg-neutral-50 p-3 border border-neutral-300 my-3 flex items-center justify-center">
                <QrCode className="w-full h-full text-neutral-900" />
              </div>

              <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-500">
                <span>Accepted with any UPI App</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyUpi}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 flex items-center gap-1 cursor-pointer"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: SCRATCH CARD DETAIL MODAL */}
      {/* ========================================================================= */}
      {activeScratch && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-[270px] w-full text-center space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-neutral-900">{activeScratch.title}</h3>

            <div
              onClick={() => {
                if (!activeScratch.scratched) {
                  setWalletBalance((prev) => prev + activeScratch.prize);
                  setUnopenedScratchCards((cards) =>
                    cards.map((c) => (c.id === activeScratch.id ? { ...c, scratched: true } : c))
                  );
                  setActiveScratch((prev) => (prev ? { ...prev, scratched: true } : null));
                  confetti({ particleCount: 70, spread: 60 });
                  triggerSoundbox(activeScratch.prize, 'Cashback Won');
                }
              }}
              className="h-44 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white flex flex-col items-center justify-center cursor-pointer shadow-inner p-4 relative overflow-hidden active:scale-95 transition-transform"
            >
              {activeScratch.scratched ? (
                <div className="animate-scale-up">
                  <span className="text-3xl">🎉</span>
                  <p className="text-2xl font-black mt-1">₹{activeScratch.prize}</p>
                  <p className="text-[10px] text-white/90 font-bold">Credited to Paytm Wallet!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Gift className="w-10 h-10 mx-auto text-amber-200 animate-pulse" />
                  <p className="text-xs font-black">Tap to Scratch &amp; Reveal</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveScratch(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: SUCCESS PAYMENT RECEIPT */}
      {/* ========================================================================= */}
      {paymentSuccessData && (
        <div className="absolute inset-0 bg-[#002E6E] z-50 flex flex-col pt-12 text-white animate-fade-in">
          <div className="flex-1 p-5 flex flex-col items-center justify-between text-center">
            <div className="space-y-3 mt-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Payment Successful</span>
                <p className="text-4xl font-black font-mono tracking-tight mt-1 text-white">
                  ₹{paymentSuccessData.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-white/80 mt-1">Paid to {paymentSuccessData.recipient}</p>
              </div>
            </div>

            {/* Receipt Card */}
            <div className="w-full bg-white text-neutral-900 rounded-3xl p-4 shadow-2xl text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b pb-2 border-neutral-100">
                <span className="text-neutral-500 text-[11px]">UPI Reference ID</span>
                <span className="font-mono font-bold">{paymentSuccessData.upiRefId}</span>
              </div>
              <div className="flex justify-between border-b pb-2 border-neutral-100">
                <span className="text-neutral-500 text-[11px]">Paid From</span>
                <span className="font-semibold truncate max-w-[150px]">{paymentSuccessData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[11px]">Time</span>
                <span className="font-semibold">{paymentSuccessData.date}</span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={() => {
                  setPaymentSuccessData(null);
                  setActiveModal('none');
                  setTargetContact(null);
                  setTransferAmount('');
                }}
                className="w-full py-3 rounded-2xl bg-[#00BAF2] hover:bg-cyan-400 text-[#002E6E] font-black text-xs shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: HISTORIC TRANSACTION RECEIPT VIEWER */}
      {/* ========================================================================= */}
      {selectedReceipt && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end animate-fade-in">
          <div className="bg-white text-neutral-900 rounded-t-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-[#002E6E]">Pay<span className="text-[#00BAF2]">tm</span></span>
                <span className="text-xs font-bold text-neutral-500">Digital Receipt</span>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <p
                className={`text-3xl font-black font-mono ${
                  selectedReceipt.type === 'credit' ? 'text-emerald-600' : 'text-neutral-900'
                }`}
              >
                {selectedReceipt.type === 'credit' ? `+₹${selectedReceipt.amount}` : `-₹${selectedReceipt.amount}`}
              </p>
              <h4 className="font-black text-sm text-neutral-800">{selectedReceipt.title}</h4>
              <p className="text-[11px] text-neutral-500">{selectedReceipt.subtitle}</p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-3 space-y-2 text-xs divide-y divide-neutral-200/60">
              <div className="flex justify-between pb-1.5">
                <span className="text-neutral-500 text-[11px]">UPI Ref No</span>
                <span className="font-mono font-bold text-neutral-800">{selectedReceipt.upiRefId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500 text-[11px]">Payment Mode</span>
                <span className="font-semibold text-neutral-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-neutral-500 text-[11px]">Timestamp</span>
                <span className="text-neutral-700">{selectedReceipt.date}, {selectedReceipt.time}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedReceipt(null);
                  setTargetContact({
                    name: selectedReceipt.title,
                    phone: '+91 98765 43210',
                    upiId: 'recipient@paytm',
                    avatarBg: 'bg-[#002E6E]'
                  });
                  setTransferAmount(String(selectedReceipt.amount));
                  setActiveModal('send_mobile');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#002E6E] text-white font-bold text-xs hover:bg-blue-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
