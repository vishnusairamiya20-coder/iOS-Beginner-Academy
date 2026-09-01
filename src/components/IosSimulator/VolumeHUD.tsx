import React, { useState, useEffect, useRef } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { playVolumeStepSound } from '../../utils/audioUtils';

interface VolumeHUDProps {
  volume: number; // 0 - 100
  isVisible: boolean;
  onVolumeChange: (newVolume: number) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const VolumeHUD: React.FC<VolumeHUDProps> = ({
  volume,
  isVisible,
  onVolumeChange,
  onInteractionStart,
  onInteractionEnd
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-3 h-3 text-white/90" />;
    if (volume <= 33) return <Volume className="w-3 h-3 text-white/90" />;
    if (volume <= 66) return <Volume1 className="w-3 h-3 text-white/90" />;
    return <Volume2 className="w-3 h-3 text-white/90" />;
  };

  const calculateVolumeFromClientY = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const height = rect.height;
    // Top is 100%, bottom is 0%
    const relativeY = clientY - rect.top;
    const clampedY = Math.max(0, Math.min(height, relativeY));
    const percentage = Math.round(((height - clampedY) / height) * 100);
    const stepped = Math.max(0, Math.min(100, Math.round(percentage / 2) * 2));
    onVolumeChange(stepped);
    playVolumeStepSound(stepped);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsExpanded(true);
    onInteractionStart?.();
    calculateVolumeFromClientY(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsExpanded(true);
    onInteractionStart?.();
    calculateVolumeFromClientY(e.touches[0].clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      calculateVolumeFromClientY(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      calculateVolumeFromClientY(e.touches[0].clientY);
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setIsExpanded(false);
        onInteractionEnd?.();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute left-2.5 top-32 z-50 transition-all duration-300 select-none ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsExpanded(false);
      }}
    >
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="iOS Volume Slider - Click or drag to adjust volume"
        className={`relative cursor-ns-resize overflow-hidden rounded-full shadow-2xl backdrop-blur-2xl transition-all duration-200 border border-white/20 ${
          isExpanded || isDragging
            ? 'w-7 h-36 bg-neutral-900/90 ring-2 ring-white/30'
            : 'w-1.5 h-28 bg-neutral-900/80 hover:w-7 hover:h-36'
        }`}
      >
        {/* Fill level */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white transition-[height] duration-75 rounded-b-full pointer-events-none"
          style={{ height: `${volume}%` }}
        />

        {/* Dynamic Icon & Feedback when expanded or hovered */}
        {(isExpanded || isDragging) && (
          <div className="absolute inset-0 flex flex-col items-center justify-between py-2.5 pointer-events-none">
            <span className="text-[9px] font-bold mix-blend-difference text-white font-mono">
              {volume}%
            </span>
            <div className="mix-blend-difference text-white">
              {getVolumeIcon()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
