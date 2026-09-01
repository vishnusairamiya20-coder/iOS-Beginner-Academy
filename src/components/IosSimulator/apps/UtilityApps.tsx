import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, Eye, Compass, Shield, Search, ArrowLeft, ArrowRight, RotateCw, BookOpen } from 'lucide-react';
import { SimulatorState } from '../../../types';

export const WeatherApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-800 text-white select-none font-sans overflow-y-auto p-4 pt-14 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Cupertino</h2>
        <div className="text-6xl font-extralight tracking-tighter">72°</div>
        <p className="text-sm font-medium text-sky-100">Mostly Sunny</p>
        <p className="text-xs text-sky-200">H:76° L:54°</p>
      </div>

      {/* Hourly forecast */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
        <p className="text-[11px] text-sky-100 uppercase tracking-wider mb-2 font-semibold">Hourly Forecast</p>
        <div className="flex justify-between items-center text-center">
          {[
            { time: 'Now', temp: '72°', icon: '☀️' },
            { time: '10 AM', temp: '74°', icon: '🌤️' },
            { time: '11 AM', temp: '75°', icon: '☀️' },
            { time: '12 PM', temp: '76°', icon: '☀️' },
            { time: '1 PM', temp: '75°', icon: '⛅' }
          ].map((h) => (
            <div key={h.time} className="flex flex-col items-center space-y-1">
              <span className="text-[11px] text-sky-100">{h.time}</span>
              <span className="text-base">{h.icon}</span>
              <span className="text-xs font-semibold">{h.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weather stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
          <div className="flex items-center gap-1 text-[11px] text-sky-200">
            <Sun className="w-3.5 h-3.5" />
            <span>UV INDEX</span>
          </div>
          <p className="text-xl font-bold mt-1">4</p>
          <p className="text-[10px] text-sky-200">Moderate today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
          <div className="flex items-center gap-1 text-[11px] text-sky-200">
            <Wind className="w-3.5 h-3.5" />
            <span>WIND</span>
          </div>
          <p className="text-xl font-bold mt-1">6 mph</p>
          <p className="text-[10px] text-sky-200">Breeze from WNW</p>
        </div>
      </div>
    </div>
  );
};

export const SafariApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  const [url, setUrl] = useState('apple.com/iphone');

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans`}>
      {/* Top web content header */}
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span>Privacy Protected</span>
        </div>
        <div className="text-xs font-semibold text-neutral-500">Safari Browser</div>
      </div>

      {/* Web Page View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-5 space-y-2 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
            Apple Guide
          </span>
          <h3 className="text-lg font-bold">Discover iOS Safari</h3>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Notice how the Safari address search bar is at the bottom of the screen? This lets you reach websites with one hand comfortably!
          </p>
        </div>

        <div className={`rounded-xl p-3 border space-y-2 ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'}`}>
          <h4 className="font-semibold text-xs flex items-center gap-1.5 text-blue-500">
            <BookOpen className="w-3.5 h-3.5" /> Reader Mode Tip
          </h4>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-tight">
            Tap the &quot;aA&quot; button on the left of any address bar to strip away all distracting ads, popups, and clutter for clean book-like reading.
          </p>
        </div>
      </div>

      {/* iOS Bottom URL Bar */}
      <div className={`p-3 border-t flex items-center gap-2 ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'}`}>
        <button className="text-neutral-400"><ArrowLeft className="w-4 h-4" /></button>
        <button className="text-neutral-400"><ArrowRight className="w-4 h-4" /></button>
        
        <div className={`flex-1 flex items-center justify-between rounded-xl px-3 py-2 border shadow-xs ${state.isDarkMode ? 'bg-black border-neutral-700' : 'bg-white border-neutral-300'}`}>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-serif font-bold text-neutral-400">aA</span>
            <span className="text-xs font-medium truncate max-w-[130px]">{url}</span>
          </div>
          <RotateCw className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="w-6 h-6 rounded-md border border-neutral-400 flex items-center justify-center text-xs font-bold text-neutral-500">
          2
        </div>
      </div>
    </div>
  );
};

export const PhotosApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const samplePhotos = [
    { id: '1', emoji: '🏔️', title: 'Mountain Sunset', date: 'Yesterday' },
    { id: '2', emoji: '🐶', title: 'Golden Retriever', date: 'Monday' },
    { id: '3', emoji: '🍕', title: 'Neapolitan Pizza', date: 'Aug 20' },
    { id: '4', emoji: '🏖️', title: 'Tropical Beach', date: 'Aug 18' },
    { id: '5', emoji: '🚲', title: 'City Cycling', date: 'Aug 15' },
    { id: '6', emoji: '☕', title: 'Morning Espresso', date: 'Aug 12' },
  ];

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans`}>
      <div className="pt-12 pb-2 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Photos</h1>
        <span className="text-xs font-medium text-blue-500 cursor-pointer">Select</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedPhoto ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 flex items-center justify-center text-6xl shadow-xl">
              {samplePhotos.find((p) => p.id === selectedPhoto)?.emoji}
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-sm">{samplePhotos.find((p) => p.id === selectedPhoto)?.title}</p>
              <p className="text-xs text-neutral-400">Live Text: &quot;San Francisco, CA 94103&quot; detected</p>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-xs font-semibold"
            >
              Back to Grid
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {samplePhotos.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPhoto(p.id)}
                className="aspect-square rounded-xl bg-gradient-to-tr from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 flex flex-col items-center justify-center text-3xl cursor-pointer hover:scale-95 transition-transform"
              >
                <span>{p.emoji}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-around text-xs font-medium text-blue-500">
        <button className="flex flex-col items-center gap-0.5 text-blue-500 font-bold">
          <span>Library</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-neutral-400">
          <span>Albums</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-neutral-400">
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export const AppStoreApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [faceIdVerifying, setFaceIdVerifying] = useState(false);

  const handleGet = (appTitle: string) => {
    setFaceIdVerifying(true);
    setTimeout(() => {
      setFaceIdVerifying(false);
      setDownloaded((d) => ({ ...d, [appTitle]: true }));
    }, 1500);
  };

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none font-sans relative`}>
      {/* Face ID confirmation modal */}
      {faceIdVerifying && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl border-2 border-blue-400 flex items-center justify-center text-blue-400 text-2xl animate-pulse">
            <span className="text-2xl">😃</span>
          </div>
          <p className="text-white font-semibold text-xs">Double Click Side Button</p>
          <span className="text-neutral-400 text-[10px]">Verifying with Face ID...</span>
        </div>
      )}

      <div className="pt-12 pb-2 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">App Store</h1>
        <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
          A
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Beginner Safety Banner */}
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 space-y-1">
          <p className="font-bold text-xs">Free vs In-App Purchases</p>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-tight">
            Apps with &quot;GET&quot; are free to download. Check beneath the button for &quot;In-App Purchases&quot; to avoid accidental subscriptions!
          </p>
        </div>

        {/* Featured Apps list */}
        <div className="space-y-3">
          {[
            { name: 'Duolingo: Language Lessons', tag: 'Education', icon: '🦉', isFree: true },
            { name: 'Shazam: Music Discovery', tag: 'Music', icon: '⚡', isFree: true },
            { name: 'Flighty: Live Flight Tracker', tag: 'Travel', icon: '✈️', isFree: true }
          ].map((app) => (
            <div
              key={app.name}
              className={`p-3 rounded-2xl flex items-center justify-between shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-2xl shadow-xs">
                  {app.icon}
                </div>
                <div>
                  <p className="font-bold text-xs truncate max-w-[130px]">{app.name}</p>
                  <p className="text-[10px] text-neutral-400">{app.tag}</p>
                </div>
              </div>

              <button
                onClick={() => handleGet(app.name)}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                  downloaded[app.name]
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-blue-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                {downloaded[app.name] ? 'OPEN' : 'GET'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
