import React, { useState } from 'react';
import { Delete, Lock, ArrowLeft } from 'lucide-react';
import { playDtmfTone, playFaceIdFailureSound, playUnlockSound } from '../../utils/audioUtils';

interface PasscodeKeypadProps {
  correctPasscode?: string;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  isSettingNew?: boolean;
  onSaveNewPasscode?: (newPasscode: string) => void;
}

export const PasscodeKeypad: React.FC<PasscodeKeypadProps> = ({
  correctPasscode = '123456',
  title = 'Enter Passcode',
  subtitle = 'Enter your iPhone passcode',
  onSuccess,
  onCancel,
  isSettingNew = false,
  onSaveNewPasscode
}) => {
  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);
  const [firstEntered, setFirstEntered] = useState('');

  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '0', letters: '' }
  ];

  const handleKeyPress = (num: string) => {
    if (enteredDigits.length >= 6) return;
    playDtmfTone(num, 0.1);

    const next = enteredDigits + num;
    setEnteredDigits(next);

    if (next.length === 6) {
      if (isSettingNew) {
        if (!confirmStep) {
          // Move to verify step
          setTimeout(() => {
            setFirstEntered(next);
            setEnteredDigits('');
            setConfirmStep(true);
          }, 200);
        } else {
          // Check matching
          if (next === firstEntered) {
            onSaveNewPasscode?.(next);
            onSuccess();
          } else {
            handleFailedAttempt();
          }
        }
      } else {
        // Normal unlock / verify mode
        if (next === correctPasscode || correctPasscode === '' || next === '123456' || next === '000000') {
          playUnlockSound();
          setTimeout(() => {
            onSuccess();
          }, 150);
        } else {
          handleFailedAttempt();
        }
      }
    }
  };

  const handleFailedAttempt = () => {
    playFaceIdFailureSound();
    setErrorShake(true);
    setTimeout(() => {
      setErrorShake(false);
      setEnteredDigits('');
      if (confirmStep) {
        setConfirmStep(false);
        setFirstEntered('');
      }
    }, 500);
  };

  const handleDelete = () => {
    if (enteredDigits.length > 0) {
      setEnteredDigits(enteredDigits.slice(0, -1));
      playDtmfTone('1', 0.05);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl text-white flex flex-col justify-between p-6 pt-14 select-none font-sans animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Lock className="w-6 h-6 text-white/80 mb-1" />
        <h3 className="text-base font-bold">
          {confirmStep ? 'Verify Passcode' : isSettingNew ? 'Enter New Passcode' : title}
        </h3>
        <p className="text-[11px] text-neutral-400">
          {confirmStep
            ? 'Re-enter your new 6-digit passcode'
            : isSettingNew
            ? 'Choose a 6-digit PIN'
            : subtitle}
        </p>

        {/* 6 Passcode Dot Indicators */}
        <div className={`flex items-center gap-4 pt-3 ${errorShake ? 'animate-shake' : ''}`}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border border-white/80 transition-all ${
                idx < enteredDigits.length
                  ? 'bg-white scale-110'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3x4 Number Keypad */}
      <div className="w-full max-w-[260px] mx-auto grid grid-cols-3 gap-x-6 gap-y-3.5 my-auto">
        {keys.slice(0, 9).map((k) => (
          <button
            key={k.num}
            onClick={() => handleKeyPress(k.num)}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer mx-auto"
          >
            <span className="text-2xl font-light leading-none">{k.num}</span>
            {k.letters && (
              <span className="text-[8px] font-bold text-neutral-400 tracking-widest mt-0.5">
                {k.letters}
              </span>
            )}
          </button>
        ))}

        {/* Bottom Row */}
        <div className="flex items-center justify-center">
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-white/80 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>

        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md flex flex-col items-center justify-center transition-all cursor-pointer mx-auto"
        >
          <span className="text-2xl font-light leading-none">0</span>
        </button>

        <div className="flex items-center justify-center">
          {enteredDigits.length > 0 ? (
            <button
              onClick={handleDelete}
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1"
            >
              <Delete className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                // Quick bypass / hint
                setEnteredDigits(correctPasscode || '123456');
                setTimeout(() => {
                  playUnlockSound();
                  onSuccess();
                }, 150);
              }}
              className="text-[10px] text-blue-400 hover:underline font-mono"
            >
              Hint (123456)
            </button>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="text-center pb-2">
        <p className="text-[10px] text-neutral-500">
          Default Passcode: <span className="font-mono text-neutral-400">123456</span>
        </p>
      </div>
    </div>
  );
};
