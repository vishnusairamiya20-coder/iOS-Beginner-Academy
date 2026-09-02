import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Code,
  Layers,
  Cpu,
  Calculator,
  Compass,
  Mail,
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Search,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  User,
  Award,
  Terminal,
  Play,
  RotateCcw,
  Zap,
  Star,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import {
  FOUNDER_PROJECTS,
  PROMPT_RECIPES,
  VISHNU_FULL_BIOGRAPHY,
  FounderProject,
  PromptRecipe
} from '../../../data/founderBio';
import { playUnlockSound, playVolumeStepSound } from '../../../utils/audioUtils';

interface FounderAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose?: () => void;
}

export const FounderApp: React.FC<FounderAppProps> = ({ state, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'projects' | 'promptlab' | 'mathlab' | 'stack'>('bio');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Prompt Lab state
  const [selectedPromptId, setSelectedPromptId] = useState<string>(PROMPT_RECIPES[0].id);
  const [customSubject, setCustomSubject] = useState<string>('Rohan R. Potdar coding at sunset with an iPhone');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Math Lab State
  const [mathInputNumber, setMathInputNumber] = useState<number>(2026);
  const [gcdA, setGcdA] = useState<number>(252);
  const [gcdB, setGcdB] = useState<number>(105);
  const [fibCount, setFibCount] = useState<number>(10);

  // Calculate Prime Factors
  const primeFactors = useMemo(() => {
    let n = Math.abs(Math.floor(mathInputNumber)) || 2;
    if (n > 100000000) n = 100000000;
    const factors: { [key: number]: number } = {};
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        n /= d;
      }
      d++;
    }
    if (n > 1) {
      factors[n] = (factors[n] || 0) + 1;
    }
    return factors;
  }, [mathInputNumber]);

  // Calculate GCD & LCM
  const { gcdResult, lcmResult, gcdSteps } = useMemo(() => {
    let a = Math.abs(Math.floor(gcdA)) || 1;
    let b = Math.abs(Math.floor(gcdB)) || 1;
    const initialProduct = a * b;
    const steps: string[] = [];
    while (b !== 0) {
      const remainder = a % b;
      const quotient = Math.floor(a / b);
      steps.push(`${a} = ${b} × ${quotient} + ${remainder}`);
      a = b;
      b = remainder;
    }
    const gcd = a;
    const lcm = Math.floor(initialProduct / gcd);
    return { gcdResult: gcd, lcmResult: lcm, gcdSteps: steps };
  }, [gcdA, gcdB]);

  // Calculate Fibonacci
  const fibonacciSequence = useMemo(() => {
    const count = Math.min(25, Math.max(2, Math.floor(fibCount) || 2));
    const seq: number[] = [0, 1];
    for (let i = 2; i < count; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
  }, [fibCount]);

  const activePrompt = useMemo(() => {
    return PROMPT_RECIPES.find((p) => p.id === selectedPromptId) || PROMPT_RECIPES[0];
  }, [selectedPromptId]);

  const compiledPrompt = useMemo(() => {
    const subject = customSubject.trim() || 'Rohan R. Potdar coding at sunset';
    return activePrompt.template.replace('[SUBJECT]', subject);
  }, [activePrompt, customSubject]);

  const handleCopyBio = () => {
    navigator.clipboard.writeText(VISHNU_FULL_BIOGRAPHY);
    setIsCopied(true);
    playUnlockSound();
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopiedPrompt(true);
    playUnlockSound();
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Text to Speech
  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead =
          "Rohan R. Potdar is an enthusiastic Class 9 student and technology innovator with a deep passion for artificial intelligence, science, and problem-solving.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Direct Communication actions
  const handleLaunchCall = () => {
    playVolumeStepSound();
    onUpdateState((s) => ({
      ...s,
      currentApp: 'phone',
      activeCall: {
        inCall: true,
        contactName: 'Rohan R. Potdar',
        contactNumber: '+91 98765 43210',
        duration: 0,
        isMuted: false,
        isSpeaker: true,
        status: 'dialing'
      }
    }));
  };

  const handleLaunchMessage = () => {
    playVolumeStepSound();
    onUpdateState((s) => ({
      ...s,
      currentApp: 'messages'
    }));
  };

  const handleOpenAppleIdSettings = () => {
    playVolumeStepSound();
    onUpdateState((s) => ({
      ...s,
      currentApp: 'settings'
    }));
  };

  return (
    <div
      className={`h-full flex flex-col ${
        state.isDarkMode ? 'bg-neutral-950 text-white' : 'bg-[#F8F9FA] text-neutral-900'
      } select-none font-sans text-xs relative overflow-hidden`}
    >
      {/* Top Header Banner with Sunset Silhouette Avatar */}
      <div
        className={`pt-12 pb-3 px-4 border-b ${
          state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90' : 'border-neutral-200 bg-white/90'
        } backdrop-blur-md sticky top-0 z-20 space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Silhouette Profile Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-700 text-white p-0.5 shadow-md flex items-center justify-center shrink-0 relative overflow-hidden group">
              <div className="w-full h-full rounded-[14px] bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                {/* Silhouette vector illustration matching sunset user photo */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-amber-300 to-rose-500 opacity-80" />
                <div className="absolute -bottom-1 w-9 h-11 bg-neutral-950 rounded-t-full shadow-lg" />
                <div className="absolute top-2 left-3 w-4 h-4 bg-amber-100 rounded-full blur-[1px] opacity-90 animate-pulse" />
                <span className="absolute bottom-0 text-[10px] font-black text-amber-200 uppercase tracking-widest z-10 drop-shadow">
                  VSR
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[8px] font-bold text-white">
                ✓
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm truncate tracking-tight">Vishnu Sai Ramiya & Rohan R. Potdar</h1>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[9px]">
                  Class 9
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                Technology Innovators & AI Builders
              </p>
            </div>
          </div>

          {/* Audio speech & Copy actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSpeech}
              title="Listen to Summary (Text to Speech)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-500 text-white animate-pulse'
                  : state.isDarkMode
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopyBio}
              title="Copy Full 2,500+ Words Biography"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isCopied
                  ? 'bg-emerald-500 text-white'
                  : state.isDarkMode
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Connect Floating Bar */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={handleLaunchCall}
            className="py-1.5 px-2 rounded-xl bg-emerald-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 shadow-xs hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>Call</span>
          </button>
          <button
            onClick={handleLaunchMessage}
            className="py-1.5 px-2 rounded-xl bg-blue-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 shadow-xs hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Message</span>
          </button>
          <a
            href="mailto:vishnusairamiya20@gmail.com"
            className="py-1.5 px-2 rounded-xl bg-purple-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 shadow-xs hover:bg-purple-600 active:scale-95 transition-all text-center"
          >
            <Mail className="w-3 h-3" />
            <span>Email</span>
          </a>
          <button
            onClick={handleOpenAppleIdSettings}
            className="py-1.5 px-2 rounded-xl bg-neutral-700 dark:bg-neutral-800 text-white font-semibold text-[10px] flex items-center justify-center gap-1 shadow-xs hover:bg-neutral-600 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Apple ID</span>
          </button>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 rounded-xl text-[10px] font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('bio');
              playVolumeStepSound();
            }}
            className={`flex-1 py-1 px-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'bio'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Biography
          </button>
          <button
            onClick={() => {
              setActiveTab('projects');
              playVolumeStepSound();
            }}
            className={`flex-1 py-1 px-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('promptlab');
              playVolumeStepSound();
            }}
            className={`flex-1 py-1 px-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'promptlab'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            AI Prompt Lab
          </button>
          <button
            onClick={() => {
              setActiveTab('mathlab');
              playVolumeStepSound();
            }}
            className={`flex-1 py-1 px-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'mathlab'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Math Sandbox
          </button>
          <button
            onClick={() => {
              setActiveTab('stack');
              playVolumeStepSound();
            }}
            className={`flex-1 py-1 px-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'stack'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Stack & Spec
          </button>
        </div>
      </div>

      {/* Main Body Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ===================== TAB 1: COMPREHENSIVE BIOGRAPHY ===================== */}
        {activeTab === 'bio' && (
          <div className="space-y-4 animate-fade-in pb-8">
            {/* Quick Metrics Bar */}
            <div
              className={`p-3 rounded-2xl border ${
                state.isDarkMode
                  ? 'bg-neutral-900/60 border-neutral-800'
                  : 'bg-white border-neutral-200'
              } grid grid-cols-3 gap-2 text-center`}
            >
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Reading Time</span>
                <p className="font-bold text-xs text-blue-500">~12 Minutes</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Length</span>
                <p className="font-bold text-xs text-emerald-500">2,850+ Words</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Academic Class</span>
                <p className="font-bold text-xs text-amber-500">Grade 9 Scholar</p>
              </div>
            </div>

            {/* In-Biography Search & Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search biography concepts (e.g. Aryabhata, Prompting, React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none border ${
                  state.isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-blue-500'
                    : 'bg-white border-neutral-200 text-black placeholder-neutral-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Article Content with High-Grade Typography */}
            <div
              className={`p-4 rounded-2xl border space-y-6 ${
                state.isDarkMode
                  ? 'bg-neutral-900/40 border-neutral-800 text-neutral-200'
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              {/* Section 1 */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <User className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">
                    1. Executive Introduction & Creator Persona
                  </h2>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  <strong>Vishnu Sai Ramiya</strong> is an emerging software engineer, mathematician, and artificial
                  intelligence developer currently completing his Class 9 academic curriculum. Operating at the
                  intersection of rigorous mathematical logic, modern web architecture, and next-generation generative
                  AI, Vishnu represents a new archetype of self-directed technical creators: young scholars who do not
                  merely consume modern technology, but actively disassemble, analyze, and re-engineer it from first
                  principles.
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  Driven by a core mission to democratize computational thinking and build tactile, highly intuitive
                  software experiences, Vishnu has spearheaded multiple ambitious software initiatives, including the
                  full-featured <strong>iOS Web Simulator & Interactive Sandbox</strong>, complex discrete mathematics
                  calculation engines, and advanced multi-modal generative prompt matrices. His approach to software
                  engineering is rooted in intellectual honesty, relentless curiosity, and an unwavering commitment to
                  craftsmanship.
                </p>
                <div
                  className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                    state.isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <p className="font-bold text-amber-500">⚡ Creator Mission Statement:</p>
                  <p className="italic opacity-85">
                    "To harness the purity of mathematical logic and the exponential power of generative intelligence to
                    build intuitive, empowering, and accessible human-computer interfaces."
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-purple-500">
                  <Calculator className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">
                    2. Academic Foundation & Mathematical Curiosity
                  </h2>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  For Vishnu, mathematics is not merely a collection of formulas to memorize for school examinations; it
                  is the universal language of reality and the foundational architecture of computation. His
                  mathematical curiosity spans pure algebra, number theory, and discrete mathematics.
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  He draws profound inspiration from the rich historical legacy of Indian mathematics—particularly the
                  seminal works of <strong>Aryabhata</strong> (who pioneered algorithms for solving indeterminate linear
                  equations through the <em>Kuttaka</em> method), <strong>Brahmagupta</strong> (who established
                  foundational arithmetic rules for zero and negative integers), and <strong>Srinivasa Ramanujan</strong>{' '}
                  (whose miraculous intuition for infinite series, continued fractions, and partition functions continues
                  to astonish modern mathematical physics).
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  Vishnu frequently explores how ancient algorithmic methods directly parallel modern computational
                  algorithms. The <em>Kuttaka</em> algorithm, for example, is functionally an early realization of the
                  Extended Euclidean Algorithm used extensively in modern public-key cryptography (such as RSA).
                  Understanding these historical origins gives Vishnu a unique perspective on algorithmic efficiency and
                  problem-solving.
                </p>
                <div
                  className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                    state.isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <span className="font-bold text-purple-400">Mathematical Rigor in Software:</span>
                  <ul className="space-y-1 list-disc list-inside opacity-85">
                    <li>
                      <strong>State Invariance:</strong> Treating state transitions as deterministic mathematical
                      functions (f(state, action) → state').
                    </li>
                    <li>
                      <strong>Asymptotic Complexity:</strong> Evaluating code paths through Big-O time and space
                      complexity.
                    </li>
                    <li>
                      <strong>Discrete Set Logic:</strong> Utilizing boolean algebra and relational set theory for data
                      management.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Code className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">3. Coding Journey & Technical Learning Stack</h2>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  Vishnu's journey into programming began not in a formal university lecture hall, but through
                  self-directed curiosity and disciplined online self-study. He systematically worked through
                  industry-recognized curricula across premier educational platforms:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <p className="font-bold text-emerald-500">freeCodeCamp</p>
                    <p className="opacity-80 text-[10px]">Responsive Web Design & Algorithmic Scripting</p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <p className="font-bold text-blue-500">GeeksforGeeks</p>
                    <p className="opacity-80 text-[10px]">Data Structures, Binary Trees & Dynamic Programming</p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <p className="font-bold text-purple-500">Codecademy & Udemy</p>
                    <p className="opacity-80 text-[10px]">TypeScript, React State Engines & Functional Paradigms</p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <p className="font-bold text-amber-500">MDN Web Docs</p>
                    <p className="opacity-80 text-[10px]">Web Audio API, DOM Event Loops & MediaDevices WebRTC</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-xs text-amber-500">Practical Hardware Diagnostics & Recovery:</h4>
                  <p className="text-xs leading-relaxed opacity-90 pt-1">
                    Vishnu recognizes that software cannot exist in a vacuum separated from hardware. To gain an intimate
                    understanding of the physical layers powering computing, he engaged in hands-on mobile device
                    repair and hardware diagnostics: screen digitizer replacements, lithium-ion battery impedance curve
                    profiling, thermal dissipation pathways, and bootloader firmware flashing.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-rose-500">
                  <Sparkles className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">4. Generative AI & Tool Exploration</h2>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  Rather than using AI as a simple conversational shortcut, Vishnu approaches Large Language Models
                  (LLMs) as highly sophisticated, non-deterministic cognitive engines that require rigorous prompt
                  engineering. He developed modular <strong>Mega-Prompt Templates</strong> incorporating:
                </p>
                <ul className="space-y-1 text-xs list-disc list-inside opacity-90">
                  <li>
                    <strong>Role & Persona Anchoring:</strong> Defining exact behavioral constraints and domain
                    authorities.
                  </li>
                  <li>
                    <strong>Negative Constraints:</strong> Eliminating generic AI clichés, hallucinations, and marketing
                    buzzwords.
                  </li>
                  <li>
                    <strong>Chain-of-Thought (CoT):</strong> Decomposing problems into logical sub-tasks before code
                    synthesis.
                  </li>
                  <li>
                    <strong>Deterministic Schemas:</strong> Enforcing strict TypeScript types and JSON payloads.
                  </li>
                </ul>
                <p className="text-xs leading-relaxed opacity-90">
                  He actively leverages <strong>Google AI Studio</strong> for developer system instructions, parameter
                  tuning (temperature, top-p, top-k), and multi-modal prompting, viewing AI as an intellectual
                  amplifier that supercharges human craftsmanship.
                </p>
              </section>

              {/* Section 5 */}
              <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-amber-500">
                  <Layers className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">5. Featured Projects & Creative Portfolio</h2>
                </div>
                <div className="space-y-3 pt-1">
                  {FOUNDER_PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className={`p-3 rounded-xl border space-y-1.5 ${
                        state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{proj.icon}</span>
                          <span className="font-bold text-xs">{proj.title}</span>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80">{proj.problemStatement}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.toolsAndApis.slice(0, 4).map((tool) => (
                          <span
                            key={tool}
                            className="px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[9px] font-mono"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 6 */}
              <section className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-sky-500">
                  <Compass className="w-4 h-4" />
                  <h2 className="font-bold text-sm tracking-tight">6. Future Roadmap & 5-Year Vision</h2>
                </div>
                <div className="space-y-2 text-xs leading-relaxed opacity-90">
                  <p>
                    <strong>Short-Term (High School):</strong> Academic excellence in Class 9 and senior secondary
                    curricula with a concentration in Advanced Mathematics, Physics, and Computer Science; competitive
                    programming in USACO and informatics olympiads; and authoring open-source developer tooling.
                  </p>
                  <p>
                    <strong>Long-Term (5-Year Horizon):</strong> Pursuing higher education in Computer Science and
                    Applied Mathematics, contributing to multimodal neural architectures, efficient local model inference,
                    and founding impactful technology products that empower millions of aspiring builders globally.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: INTERACTIVE PROJECTS SHOWCASE ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-4 animate-fade-in pb-8">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Explore Rohan's flagship software projects combining mathematics, systems engineering, and generative AI.
            </p>

            <div className="space-y-4">
              {FOUNDER_PROJECTS.map((project, idx) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    state.isDarkMode
                      ? 'bg-neutral-900/70 border-neutral-800'
                      : 'bg-white border-neutral-200'
                  } shadow-xs`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-sm">
                        {project.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs">{project.title}</h3>
                        <span className="text-[10px] text-neutral-400">{project.category}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {project.status}
                    </span>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      Problem Statement
                    </span>
                    <p className="text-[11px] leading-relaxed opacity-90">{project.problemStatement}</p>
                  </div>

                  {/* Technical Architecture */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                      Technical Architecture
                    </span>
                    <p className="text-[11px] leading-relaxed opacity-90">{project.technicalArchitecture}</p>
                  </div>

                  {/* Tools / APIs Tags */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                      Technologies & Stack
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.toolsAndApis.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[9px] font-mono text-neutral-700 dark:text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Learnings */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px]">
                    <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-950/60">
                      <span className="font-bold text-rose-400">Key Challenge:</span>
                      <p className="opacity-80 mt-0.5">{project.challengesOvercome}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-950/60">
                      <span className="font-bold text-emerald-400">Core Learning:</span>
                      <p className="opacity-80 mt-0.5">{project.keyLearnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: GENERATIVE AI PROMPT LAB ===================== */}
        {activeTab === 'promptlab' && (
          <div className="space-y-4 animate-fade-in pb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-900/30 to-indigo-900/30 border border-purple-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Rohan's Mega-Prompt Generator</span>
              </div>
              <p className="text-[11px] opacity-80">
                Test and export Rohan's high-fidelity prompt templates optimized for Google AI Studio and generative AI
                transformations.
              </p>
            </div>

            {/* Select Style Preset */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-neutral-400">Select Style Transformation</label>
              <div className="grid grid-cols-2 gap-2">
                {PROMPT_RECIPES.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      setSelectedPromptId(recipe.id);
                      playVolumeStepSound();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPromptId === recipe.id
                        ? 'border-purple-500 bg-purple-500/15 text-purple-400 font-bold shadow-xs'
                        : state.isDarkMode
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-xs truncate">{recipe.title}</p>
                    <p className="text-[9px] opacity-70 truncate font-normal">{recipe.styleCategory}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Subject Customizer */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-400">Subject / Target Concept</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter what you want to transform..."
                className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                  state.isDarkMode
                    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-purple-500'
                    : 'bg-white border-neutral-200 text-black focus:border-purple-500'
                }`}
              />
            </div>

            {/* Compiled Prompt Code Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-purple-400">Compiled Production Prompt</span>
                <button
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 rounded-lg bg-purple-500 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-purple-600 cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div
                className={`p-3 rounded-2xl border font-mono text-[11px] leading-relaxed select-text ${
                  state.isDarkMode
                    ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
                    : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                }`}
              >
                {compiledPrompt}
              </div>
            </div>

            {/* Developer System Instruction Snippet */}
            <div
              className={`p-3 rounded-2xl border space-y-1 text-[11px] ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="font-bold text-amber-500 text-[10px] uppercase">
                Google AI Studio System Instruction
              </span>
              <p className="italic opacity-85">{activePrompt.systemInstructionSnippet}</p>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: INTERACTIVE MATH & LOGIC SANDBOX ===================== */}
        {activeTab === 'mathlab' && (
          <div className="space-y-4 animate-fade-in pb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-900/30 to-emerald-900/30 border border-blue-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Calculator className="w-4 h-4" />
                <span>Discrete Mathematics & Number Theory Engine</span>
              </div>
              <p className="text-[11px] opacity-80">
                Interactive computational algorithms developed by Rohan celebrating ancient and modern mathematical logic.
              </p>
            </div>

            {/* Tool 1: Prime Factorization Tree */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-500">1. Prime Factorization Engine</span>
                <span className="text-[10px] font-mono text-neutral-400">Sieve & Branching</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={10000000}
                  value={mathInputNumber}
                  onChange={(e) => setMathInputNumber(Number(e.target.value))}
                  className={`flex-1 p-2 rounded-xl text-xs outline-none border font-mono ${
                    state.isDarkMode
                      ? 'bg-neutral-950 border-neutral-800 text-white'
                      : 'bg-neutral-50 border-neutral-200 text-black'
                  }`}
                />
                <button
                  onClick={() => setMathInputNumber(Math.floor(Math.random() * 9999) + 10)}
                  className="px-3 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs cursor-pointer"
                >
                  Random
                </button>
              </div>

              {/* Factors Output Display */}
              <div
                className={`p-3 rounded-xl border text-xs flex flex-wrap items-center gap-1.5 ${
                  state.isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                }`}
              >
                <span className="font-bold text-neutral-400">{mathInputNumber} = </span>
                {Object.keys(primeFactors).length === 0 ? (
                  <span className="text-neutral-400 italic">Enter a number greater than 1</span>
                ) : (
                  Object.entries(primeFactors).map(([factor, exp], i) => {
                    const exponent = Number(exp);
                    return (
                      <span
                        key={factor}
                        className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold"
                      >
                        {factor}
                        {exponent > 1 && <sup className="text-[9px] text-amber-400 ml-0.5">{exponent}</sup>}
                        {i < Object.keys(primeFactors).length - 1 ? ' × ' : ''}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Tool 2: Euclidean GCD & LCM (Aryabhata Kuttaka Algorithm) */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-500">2. Euclidean GCD & LCM Algorithm</span>
                <span className="text-[10px] font-mono text-neutral-400">Aryabhata / Euclid</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold">Number A</label>
                  <input
                    type="number"
                    value={gcdA}
                    onChange={(e) => setGcdA(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl text-xs outline-none border font-mono ${
                      state.isDarkMode
                        ? 'bg-neutral-950 border-neutral-800 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold">Number B</label>
                  <input
                    type="number"
                    value={gcdB}
                    onChange={(e) => setGcdB(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl text-xs outline-none border font-mono ${
                      state.isDarkMode
                        ? 'bg-neutral-950 border-neutral-800 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-black'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">Greatest Common Divisor (GCD)</span>
                  <p className="font-extrabold text-base text-purple-400 font-mono">{gcdResult}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">Least Common Multiple (LCM)</span>
                  <p className="font-extrabold text-base text-emerald-400 font-mono">{lcmResult}</p>
                </div>
              </div>

              {/* Euclidean Steps Trace */}
              <div className="space-y-1 text-[10px] font-mono text-neutral-400">
                <span className="font-bold uppercase">Algorithmic Division Trace:</span>
                {gcdSteps.map((step, idx) => (
                  <p key={idx} className="p-1 rounded bg-neutral-100 dark:bg-neutral-950/60 text-neutral-300">
                    Step {idx + 1}: {step}
                  </p>
                ))}
              </div>
            </div>

            {/* Tool 3: Fibonacci & Golden Ratio Generator */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-500">3. Fibonacci & Golden Ratio (Φ ≈ 1.618)</span>
                <span className="text-[10px] font-mono text-neutral-400">Sequence Generator</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Length: {fibCount} terms</span>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={fibCount}
                  onChange={(e) => setFibCount(Number(e.target.value))}
                  className="w-40 accent-amber-500"
                />
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                {fibonacciSequence.map((num, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  >
                    F<sub>{i}</sub> = {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: TECHNICAL STACK & HARDWARE SPECS ===================== */}
        {activeTab === 'stack' && (
          <div className="space-y-4 animate-fade-in pb-8">
            {/* Core Competencies Progress */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="font-bold text-xs text-blue-500 uppercase tracking-wider">
                Technical Proficiency Metrics
              </span>
              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Mathematical Logic & Discrete Math', pct: 96, color: 'bg-purple-500' },
                  { name: 'TypeScript & Type Systems', pct: 94, color: 'bg-blue-500' },
                  { name: 'Generative AI & Mega-Prompting', pct: 95, color: 'bg-rose-500' },
                  { name: 'React 18 & Component Systems', pct: 92, color: 'bg-emerald-500' },
                  { name: 'Hardware Diagnostics & Screen Repair', pct: 88, color: 'bg-amber-500' },
                  { name: 'Web Audio API & Synthesizers', pct: 90, color: 'bg-sky-500' }
                ].map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-bold font-mono">{skill.pct}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${skill.color} h-full rounded-full transition-all`}
                        style={{ width: `${skill.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Platforms Mastered */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="font-bold text-xs text-emerald-500 uppercase tracking-wider">
                Platforms & Educational Journey
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { title: 'freeCodeCamp', desc: 'Web design & algorithmic scripting' },
                  { title: 'GeeksforGeeks', desc: 'Data structures & dynamic programming' },
                  { title: 'Google AI Studio', desc: 'Gemini system instructions & agents' },
                  { title: 'MDN Web Docs', desc: 'WebRTC, DOM & Web Audio standards' }
                ].map((plat) => (
                  <div
                    key={plat.title}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-0.5"
                  >
                    <p className="font-bold text-[11px] text-neutral-800 dark:text-neutral-200">{plat.title}</p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">{plat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Developer Details Card */}
            <div
              className={`p-4 rounded-2xl border space-y-2 text-xs ${
                state.isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="font-bold text-amber-500 uppercase tracking-wider">Developer & Account Verification</span>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-[11px]">
                <div className="py-1.5 flex justify-between">
                  <span className="text-neutral-400">Founder Name</span>
                  <span className="font-bold">Rohan R. Potdar</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-neutral-400">Academic Standing</span>
                  <span className="font-bold text-blue-400">Class 9 Student</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-neutral-400">Official Gmail / Sync</span>
                  <span className="font-mono text-purple-400">rohanpotdar@gmail.com</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-neutral-400">Apple Account</span>
                  <span className="font-mono text-emerald-400">rohanpotdar@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
