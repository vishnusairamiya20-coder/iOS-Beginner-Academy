import React from 'react';
import { Lock, Flashlight, Camera, MessageSquare, Bell, X, Calendar, Check } from 'lucide-react';
import { SimulatorState } from '../../types';

interface NotificationCenterProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
  onOpenApp: (app: any) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  state,
  onUpdateState,
  onClose,
  onOpenApp
}) => {
  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({
      ...s,
      notifications: s.notifications.filter((n) => n.id !== id)
    }));
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-2xl z-40 p-4 pt-12 flex flex-col justify-between select-none text-white font-sans animate-fade-in"
    >
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Lock icon & Time header */}
        <div className="text-center space-y-1 pt-2">
          <div className="flex items-center justify-center gap-1 text-xs text-white/80">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">Thursday, August 27</span>
          </div>
          <div className="text-6xl font-extralight tracking-tight font-sans">
            9:41
          </div>
        </div>

        {/* Notifications list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-white/70 px-1 font-semibold">
            <span>Notification Center</span>
            {state.notifications.length > 0 && (
              <button
                onClick={() => onUpdateState((s) => ({ ...s, notifications: [] }))}
                className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {state.notifications.length === 0 ? (
            <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur border border-white/10 text-center text-xs text-white/60">
              No Older Notifications
            </div>
          ) : (
            state.notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onClose();
                  onOpenApp('messages');
                }}
                className="p-3 rounded-2xl bg-neutral-900/80 backdrop-blur border border-white/15 shadow-md flex items-start gap-2.5 cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{n.app}</span>
                    <span className="text-[10px] text-white/50">{n.time}</span>
                  </div>
                  <p className="font-semibold text-xs text-white/90 truncate">{n.title}</p>
                  <p className="text-[11px] text-white/70 truncate">{n.message}</p>
                </div>
                <button
                  onClick={(e) => dismissNotification(n.id, e)}
                  className="text-white/40 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lock Screen bottom Quick buttons */}
      <div className="pb-3 flex items-center justify-between px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
          }}
          className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
            state.isFlashlightOn ? 'bg-white text-black shadow-lg shadow-white/40' : 'bg-neutral-800/80 text-white'
          }`}
        >
          <Flashlight className="w-5 h-5" />
        </button>

        <span className="text-[10px] text-white/60">Swipe up to unlock</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            onOpenApp('camera');
          }}
          className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-neutral-700"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
