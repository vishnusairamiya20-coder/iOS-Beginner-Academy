import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Grid,
  Plus,
  User,
  Star,
  Clock,
  Voicemail,
  Search,
  ChevronRight,
  Info,
  Video,
  MessageSquare,
  Delete,
  X,
  Check
} from 'lucide-react';
import { SimulatorState } from '../../../types';
import { playDtmfTone, startPhoneRingTone, stopPhoneRingTone } from '../../../utils/audioUtils';

interface PhoneAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarColor: string;
  isFavorite?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Mom ❤️', phone: '+1 (555) 234-5678', email: 'mom@family.com', avatarColor: 'from-pink-500 to-rose-500', isFavorite: true },
  { id: 'c2', name: 'Sarah (iOS Guide)', phone: '+1 (555) 890-1234', email: 'sarah.guide@apple.com', avatarColor: 'from-purple-500 to-indigo-500', isFavorite: true },
  { id: 'c3', name: 'Alex (Work - Google)', phone: '+1 (555) 456-7890', email: 'alex@google.com', avatarColor: 'from-blue-500 to-cyan-500', isFavorite: true },
  { id: 'c4', name: 'Apple Support', phone: '1-800-275-2273', email: 'support@apple.com', avatarColor: 'from-neutral-700 to-neutral-900', isFavorite: false },
  { id: 'c5', name: 'Dr. Emily Carter', phone: '+1 (555) 345-6789', email: 'carter.clinic@health.org', avatarColor: 'from-emerald-500 to-teal-600', isFavorite: false },
  { id: 'c6', name: 'Pizza Roma Delivery', phone: '+1 (555) 789-0123', email: 'orders@pizzaroma.com', avatarColor: 'from-amber-500 to-orange-500', isFavorite: false },
];

export const PhoneApp: React.FC<PhoneAppProps> = ({ state, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'>('keypad');
  const [dialNumber, setDialNumber] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [searchContact, setSearchContact] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddContactModal, setIsAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  // Call simulation state
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended' | null>(null);
  const [currentCaller, setCurrentCaller] = useState<{ name: string; number: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showInCallKeypad, setShowInCallKeypad] = useState(false);
  const [callAiSpokenLine, setCallAiSpokenLine] = useState('');

  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keypad keys definition
  const keypadKeys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'A B C' },
    { num: '3', sub: 'D E F' },
    { num: '4', sub: 'G H I' },
    { num: '5', sub: 'J K L' },
    { num: '6', sub: 'M N O' },
    { num: '7', sub: 'P Q R S' },
    { num: '8', sub: 'T U V' },
    { num: '9', sub: 'W X Y Z' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' },
  ];

  const handleKeyPress = (num: string) => {
    playDtmfTone(num);
    setDialNumber((prev) => prev + num);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  // Start outgoing call
  const startCall = (name: string, number: string) => {
    setCurrentCaller({ name: name || number || 'Unknown', number });
    setCallStatus('ringing');
    setCallDuration(0);
    setCallAiSpokenLine('Ringing...');
    startPhoneRingTone();

    // Auto-answer after 2.5s with realistic simulation
    setTimeout(() => {
      stopPhoneRingTone();
      setCallStatus('connected');
      const lines = [
        `"Hello! Thanks for calling ${name || 'our service'}. How can I help you today?"`,
        `"Hey! Great to hear from you. How are you liking your new iPhone?"`,
        `"Thank you for calling Apple Support. Your connection is clear and secure."`
      ];
      setCallAiSpokenLine(lines[Math.floor(Math.random() * lines.length)]);
    }, 2800);
  };

  // End call
  const endCall = () => {
    stopPhoneRingTone();
    setCallStatus('ended');
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setTimeout(() => {
      setCallStatus(null);
      setCurrentCaller(null);
      setCallDuration(0);
      setCallAiSpokenLine('');
      setShowInCallKeypad(false);
    }, 800);
  };

  // Handle call timer when connected
  useEffect(() => {
    if (callStatus === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      stopPhoneRingTone();
    };
  }, [callStatus]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newC: Contact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim() || '+1 (555) 000-0000',
      email: newContactEmail.trim() || `${newContactName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatarColor: 'from-blue-500 to-indigo-600',
      isFavorite: false
    };
    setContacts((prev) => [newC, ...prev]);
    setIsAddContactModal(false);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactEmail('');
  };

  // Active Call Screen Overlay
  if (callStatus) {
    return (
      <div className="h-full flex flex-col justify-between bg-neutral-900 text-white select-none font-sans p-6 pt-16 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black z-0" />

        <div className="relative z-10 text-center space-y-2 pt-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto flex items-center justify-center text-3xl font-bold shadow-2xl border-2 border-white/20">
            {currentCaller?.name?.[0] || 'U'}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{currentCaller?.name}</h2>
          <p className="text-xs text-neutral-400 font-mono">{currentCaller?.number}</p>
          
          <div className="pt-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-neutral-200">
              {callStatus === 'ringing' ? 'Calling...' : callStatus === 'connected' ? formatDuration(callDuration) : 'Call Ended'}
            </span>
          </div>

          {callStatus === 'connected' && callAiSpokenLine && (
            <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/15 text-xs text-neutral-200 italic max-w-xs mx-auto animate-fade-in">
              {callAiSpokenLine}
            </div>
          )}
        </div>

        {/* In-Call Controls Matrix */}
        <div className="relative z-10 space-y-6 pb-6">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto text-center">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition-all ${
                isMuted ? 'bg-white text-black' : 'bg-neutral-800/90 text-white hover:bg-neutral-700'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-[10px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setShowInCallKeypad(!showInCallKeypad)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition-all ${
                showInCallKeypad ? 'bg-white text-black' : 'bg-neutral-800/90 text-white hover:bg-neutral-700'
              }`}
            >
              <Grid className="w-6 h-6" />
              <span className="text-[10px] font-medium">Keypad</span>
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition-all ${
                isSpeaker ? 'bg-white text-black' : 'bg-neutral-800/90 text-white hover:bg-neutral-700'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              <span className="text-[10px] font-medium">Speaker</span>
            </button>
          </div>

          {/* Red End Call Button */}
          <div className="flex justify-center">
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-90 flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans relative`}>
      {/* Add Contact Modal */}
      {isAddContactModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 pt-14 flex flex-col justify-between animate-fade-in">
          <div className={`rounded-3xl p-5 space-y-4 shadow-2xl ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setIsAddContactModal(false)} className="text-blue-500 font-medium text-xs">
                Cancel
              </button>
              <span className="font-bold text-sm">New Contact</span>
              <button onClick={handleAddContact} className="text-blue-500 font-bold text-xs">
                Done
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Full Name</label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Emily Watson"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent mt-1 outline-none font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent mt-1 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Email (Gmail / iCloud)</label>
                <input
                  type="email"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent mt-1 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Sheet */}
      {selectedContact && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm p-4 pt-14 flex flex-col justify-end animate-fade-in">
          <div className={`rounded-3xl p-5 space-y-4 max-h-[85%] overflow-y-auto ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'} shadow-2xl`}>
            <div className="flex justify-end">
              <button onClick={() => setSelectedContact(null)} className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center space-y-2">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${selectedContact.avatarColor} mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                {selectedContact.name[0]}
              </div>
              <h3 className="text-lg font-bold">{selectedContact.name}</h3>
              <p className="text-xs text-neutral-400 font-mono">{selectedContact.phone}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedContact(null);
                  startCall(selectedContact.name, selectedContact.phone);
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-blue-500/10 text-blue-500 font-semibold text-[10px]"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  onUpdateState((s) => ({ ...s, currentApp: 'messages' }));
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-blue-500/10 text-blue-500 font-semibold text-[10px]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  startCall(selectedContact.name, selectedContact.phone);
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-blue-500/10 text-blue-500 font-semibold text-[10px]"
              >
                <Video className="w-4 h-4" />
                <span>FaceTime</span>
              </button>
              <button
                onClick={() => {
                  setContacts((prev) =>
                    prev.map((c) => (c.id === selectedContact.id ? { ...c, isFavorite: !c.isFavorite } : c))
                  );
                  setSelectedContact((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl font-semibold text-[10px] ${
                  selectedContact.isFavorite ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                <Star className="w-4 h-4" fill={selectedContact.isFavorite ? 'currentColor' : 'none'} />
                <span>Favorite</span>
              </button>
            </div>

            <div className="border-t pt-3 border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                <span className="text-[10px] text-neutral-400 block font-semibold">Email (Gmail / iCloud)</span>
                <span className="font-medium text-blue-500">{selectedContact.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto pt-14 pb-2 px-4">
        {/* KEYPAD TAB */}
        {activeTab === 'keypad' && (
          <div className="h-full flex flex-col justify-between py-2">
            {/* Number Display */}
            <div className="h-14 flex items-center justify-center relative">
              <span className="text-2xl font-normal tracking-wide truncate max-w-[240px]">
                {dialNumber || ''}
              </span>
              {dialNumber && (
                <button
                  onClick={handleBackspace}
                  className="absolute right-4 p-2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dialpad Matrix */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-5 max-w-[260px] mx-auto">
              {keypadKeys.map((k) => (
                <button
                  key={k.num}
                  onClick={() => handleKeyPress(k.num)}
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                    state.isDarkMode
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-200'
                  }`}
                >
                  <span className="text-2xl font-light leading-none">{k.num}</span>
                  {k.sub && <span className="text-[8px] font-bold tracking-widest text-neutral-400 mt-0.5">{k.sub}</span>}
                </button>
              ))}
            </div>

            {/* Green Call Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  if (dialNumber) startCall('Direct Dial', dialNumber);
                  else startCall('Mom ❤️', '+1 (555) 234-5678');
                }}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 flex items-center justify-center text-white shadow-lg transition-transform cursor-pointer"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Contacts</h1>
              <button
                onClick={() => setIsAddContactModal(true)}
                className="p-1 rounded-full text-blue-500 hover:bg-blue-500/10 cursor-pointer"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-black'}`}>
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                className="bg-transparent text-xs w-full outline-none"
              />
            </div>

            {/* My Card */}
            <div
              onClick={() =>
                setSelectedContact({
                  id: 'me',
                  name: state.appleId.name,
                  phone: state.appleId.phone,
                  email: state.appleId.email,
                  avatarColor: 'from-blue-600 to-indigo-700'
                })
              }
              className={`p-3 rounded-2xl flex items-center gap-3 border cursor-pointer ${
                state.isDarkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                JA
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs">{state.appleId.name}</p>
                <p className="text-[10px] text-neutral-400">My Card • {state.gmailSync.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>

            {/* Contact list */}
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {contacts
                .filter((c) => c.name.toLowerCase().includes(searchContact.toLowerCase()))
                .map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="py-2.5 flex items-center justify-between hover:opacity-75 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${contact.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                        {contact.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{contact.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{contact.phone}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* RECENTS TAB */}
        {activeTab === 'recents' && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Recents</h1>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {[
                { name: 'Mom ❤️', type: 'incoming', time: '2:15 PM', missed: false },
                { name: 'Alex (Work - Google)', type: 'outgoing', time: '11:40 AM', missed: false },
                { name: '+1 (800) 275-2273', type: 'missed', time: 'Yesterday', missed: true },
                { name: 'Sarah (iOS Guide)', type: 'incoming', time: 'Monday', missed: false },
                { name: 'Unknown Caller', type: 'missed', time: 'Sunday', missed: true }
              ].map((call, idx) => (
                <div
                  key={idx}
                  onClick={() => startCall(call.name, '+1 (555) 123-4567')}
                  className="py-3 flex items-center justify-between hover:opacity-80 cursor-pointer"
                >
                  <div>
                    <p className={`font-semibold text-xs ${call.missed ? 'text-red-500' : ''}`}>
                      {call.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 capitalize">{call.type} Call</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">{call.time}</span>
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Favorites</h1>
            <div className="grid grid-cols-2 gap-3">
              {contacts.filter((c) => c.isFavorite).map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => startCall(contact.name, contact.phone)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border cursor-pointer active:scale-95 transition-transform ${
                    state.isDarkMode ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${contact.avatarColor} text-white font-bold flex items-center justify-center text-lg shadow-md`}>
                    {contact.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xs truncate max-w-[100px]">{contact.name}</p>
                    <span className="text-[10px] text-emerald-500 font-medium">Tap to Call</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOICEMAIL TAB */}
        {activeTab === 'voicemail' && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Voicemail</h1>
            <div className="space-y-2">
              <div className={`p-3 rounded-2xl border space-y-2 ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Mom ❤️</span>
                  <span className="text-[10px] text-neutral-400">Today, 2:16 PM</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                  &quot;Hey honey! Just wanted to make sure your new iPhone setup is going smoothly. Call me when you get a second!&quot;
                </p>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => startCall('Mom ❤️', '+1 (555) 234-5678')}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold"
                  >
                    Call Back
                  </button>
                  <span className="text-[10px] text-neutral-400 font-mono">0:24</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Phone Tabs Bar */}
      <div className={`pt-2 pb-3 px-2 border-t flex justify-around text-[10px] font-medium ${
        state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90 text-neutral-400' : 'border-neutral-200 bg-neutral-50/90 text-neutral-500'
      }`}>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'favorites' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Star className="w-4 h-4" />
          <span>Favorites</span>
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'recents' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Clock className="w-4 h-4" />
          <span>Recents</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'contacts' ? 'text-blue-500 font-bold' : ''}`}
        >
          <User className="w-4 h-4" />
          <span>Contacts</span>
        </button>
        <button
          onClick={() => setActiveTab('keypad')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'keypad' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Grid className="w-4 h-4" />
          <span>Keypad</span>
        </button>
        <button
          onClick={() => setActiveTab('voicemail')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'voicemail' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Voicemail className="w-4 h-4" />
          <span>Voicemail</span>
        </button>
      </div>
    </div>
  );
};
