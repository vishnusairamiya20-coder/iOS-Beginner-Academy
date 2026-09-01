import React, { useState } from 'react';
import { SimulatorState } from '../../../types';

interface CalculatorAppProps {
  state: SimulatorState;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForNext) {
      setDisplay(digit);
      setWaitingForNext(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForNext(false);
  };

  const performOp = (op: string) => {
    const current = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(current);
    } else if (operator) {
      const result = calculate(prevVal, current, operator);
      setDisplay(String(result));
      setPrevVal(result);
    }
    setWaitingForNext(true);
    setOperator(op);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operator && prevVal !== null) {
      const current = parseFloat(display);
      const result = calculate(prevVal, current, operator);
      setDisplay(String(result));
      setPrevVal(null);
      setOperator(null);
      setWaitingForNext(true);
    }
  };

  return (
    <div className="h-full flex flex-col justify-end bg-black text-white select-none p-4 pb-8 font-sans">
      {/* Display */}
      <div className="text-right text-5xl font-light tracking-tight mb-4 px-2 truncate overflow-hidden">
        {display}
      </div>

      {/* Calculator Keypad Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={clear}
          className="aspect-square rounded-full bg-[#A5A5A5] text-black font-medium text-lg flex items-center justify-center active:bg-white transition-colors"
        >
          {display === '0' && !prevVal ? 'AC' : 'C'}
        </button>
        <button
          onClick={() => setDisplay(String(parseFloat(display) * -1))}
          className="aspect-square rounded-full bg-[#A5A5A5] text-black font-medium text-lg flex items-center justify-center active:bg-white transition-colors"
        >
          ±
        </button>
        <button
          onClick={() => setDisplay(String(parseFloat(display) / 100))}
          className="aspect-square rounded-full bg-[#A5A5A5] text-black font-medium text-lg flex items-center justify-center active:bg-white transition-colors"
        >
          %
        </button>
        <button
          onClick={() => performOp('÷')}
          className={`aspect-square rounded-full font-medium text-xl flex items-center justify-center transition-colors ${
            operator === '÷' ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white active:bg-[#ffb442]'
          }`}
        >
          ÷
        </button>

        {['7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => inputDigit(num)}
            className="aspect-square rounded-full bg-[#333333] text-white font-normal text-xl flex items-center justify-center active:bg-[#737373] transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => performOp('×')}
          className={`aspect-square rounded-full font-medium text-xl flex items-center justify-center transition-colors ${
            operator === '×' ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white active:bg-[#ffb442]'
          }`}
        >
          ×
        </button>

        {['4', '5', '6'].map((num) => (
          <button
            key={num}
            onClick={() => inputDigit(num)}
            className="aspect-square rounded-full bg-[#333333] text-white font-normal text-xl flex items-center justify-center active:bg-[#737373] transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => performOp('−')}
          className={`aspect-square rounded-full font-medium text-xl flex items-center justify-center transition-colors ${
            operator === '−' ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white active:bg-[#ffb442]'
          }`}
        >
          −
        </button>

        {['1', '2', '3'].map((num) => (
          <button
            key={num}
            onClick={() => inputDigit(num)}
            className="aspect-square rounded-full bg-[#333333] text-white font-normal text-xl flex items-center justify-center active:bg-[#737373] transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => performOp('+')}
          className={`aspect-square rounded-full font-medium text-xl flex items-center justify-center transition-colors ${
            operator === '+' ? 'bg-white text-[#FF9F0A]' : 'bg-[#FF9F0A] text-white active:bg-[#ffb442]'
          }`}
        >
          +
        </button>

        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 rounded-full bg-[#333333] text-white font-normal text-xl flex items-center pl-7 active:bg-[#737373] transition-colors"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="aspect-square rounded-full bg-[#333333] text-white font-normal text-xl flex items-center justify-center active:bg-[#737373] transition-colors"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="aspect-square rounded-full bg-[#FF9F0A] text-white font-medium text-xl flex items-center justify-center active:bg-[#ffb442] transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
};
