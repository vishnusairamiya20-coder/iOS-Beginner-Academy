import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstallPrompt: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstallPrompt
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chrome' | 'samsung' | 'qr' | 'apk'>('chrome');

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate QR code URL using a public QR service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Install on Android</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  PWA Ready
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Run this app natively on your Android device with offline access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Install Button if Native Prompt is Available */}
        {deferredPrompt ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between gap-4 shadow-md">
            <div>
              <p className="font-bold text-sm">Direct Android Install Available!</p>
              <p className="text-xs text-emerald-100">
                Tap below to immediately add the app to your Android home screen.
              </p>
            </div>
            <button
              onClick={() => {
                onTriggerInstallPrompt();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Now</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              This web app is configured as a <strong>Progressive Web App (PWA)</strong>. When opened in Chrome or your Android browser, it installs as a full standalone app with an icon on your home screen and app drawer!
            </p>
          </div>
        )}

        {/* Instructions Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/70 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chrome')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'chrome'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Google Chrome
            </button>
            <button
              onClick={() => setActiveTab('samsung')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'samsung'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Samsung Internet / Firefox
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'qr'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Scan QR Code
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'apk'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Export APK
            </button>
          </div>

          {/* Chrome Instructions */}
          {activeTab === 'chrome' && (
            <div className="space-y-3 animate-fade-in text-xs text-neutral-700 dark:text-neutral-300">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Open this link in Chrome on Android</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Copy the link below or scan the QR code using your Android camera.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Tap the 3 vertical dots (⋮) menu</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Located in the top-right corner of Google Chrome.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    The app will be installed to your phone like a native Android APK, launching in full screen without browser tabs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Samsung / Firefox Instructions */}
          {activeTab === 'samsung' && (
            <div className="space-y-3 animate-fade-in text-xs text-neutral-700 dark:text-neutral-300">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">In Samsung Internet</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Tap the <strong>menu icon (☰)</strong> at bottom right &gt; tap <strong>+ Add page to</strong> &gt; select <strong>Home screen</strong> or <strong>App screen</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">In Firefox for Android</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Tap the <strong>3 dots (⋮)</strong> &gt; tap <strong>Install</strong> or <strong>Add to Home screen</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 space-y-3 animate-fade-in text-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-200 inline-block">
                <img src={qrCodeUrl} alt="QR Code to open on Android" className="w-40 h-40" />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Scan this code with your Android Camera app or Google Lens to open and install immediately on your phone.
              </p>
            </div>
          )}

          {/* APK Export Tab */}
          {activeTab === 'apk' && (
            <div className="space-y-3 animate-fade-in text-xs text-neutral-700 dark:text-neutral-300">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/60 space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">
                  Want a standalone .APK file for Google Play / Sideloading?
                </p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Because this app is already configured with <code className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">manifest.json</code> and service worker, you can generate an Android APK / AAB package in 1 minute using <strong>PWABuilder</strong> or <strong>Bubblewrap</strong>:
                </p>
                <ol className="list-decimal pl-4 text-[11px] space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li>Visit <strong>PWABuilder.com</strong> in your browser</li>
                  <li>Paste the app URL</li>
                  <li>Click <strong>Build My PWA &gt; Android &gt; Generate APK/Package</strong></li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Copy App Link Section */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono truncate">
            <span className="truncate flex-1">{appUrl}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
