import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function Pomodoro() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(SETTINGS.work);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Audio play failed', e));
    }
    // Auto switch mode? Maybe just alert
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(SETTINGS[mode]);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(SETTINGS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((SETTINGS[mode] - timeLeft) / SETTINGS[mode]) * 100;

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-8">
      {/* Mode Switcher */}
      <div className="flex justify-center p-2 bg-gray-100 rounded-3xl inline-flex mx-auto">
        {(['work', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              mode === m
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            className="stroke-gray-100 fill-none"
            strokeWidth="12"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            className="stroke-indigo-600 fill-none"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (100 - progress) / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <div className="text-6xl font-black text-gray-900 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
            {mode === 'work' ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            <span>{mode === 'work' ? 'Focus Time' : 'Break Time'}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
        >
          {soundEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleTimer}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
            isActive 
              ? 'bg-gray-900 text-white shadow-gray-200' 
              : 'bg-indigo-600 text-white shadow-indigo-200'
          }`}
        >
          {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-left">
        <h4 className="font-bold text-indigo-900 mb-2">Pro Tip:</h4>
        <p className="text-sm text-indigo-700 leading-relaxed">
          The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This helps maintain focus and prevents burnout.
        </p>
      </div>
    </div>
  );
}
