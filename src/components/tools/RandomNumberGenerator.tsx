import React, { useState } from 'react';
import { Hash, RefreshCw, Copy, Check, Settings2 } from 'lucide-react';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(true);

  const generate = () => {
    const newResults: number[] = [];
    const range = max - min + 1;

    if (!allowDuplicates && count > range) {
      alert(`Cannot generate ${count} unique numbers in a range of ${range}.`);
      return;
    }

    if (allowDuplicates) {
      for (let i = 0; i < count; i++) {
        newResults.push(Math.floor(Math.random() * range) + min);
      }
    } else {
      const pool = Array.from({ length: range }, (_, i) => i + min);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        newResults.push(pool.splice(idx, 1)[0]);
      }
    }
    setResults(newResults);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(results.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Min Value</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Max Value</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">How Many Numbers?</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none font-bold"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${allowDuplicates ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowDuplicates ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-sm font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">Allow Duplicates</span>
        </label>

        <button
          onClick={generate}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Generate Now</span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">Generated Results</label>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied All!' : 'Copy Results'}</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 p-8 bg-white border-2 border-indigo-100 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
            {results.map((num, idx) => (
              <div 
                key={idx}
                className="w-16 h-16 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xl border border-indigo-100"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex items-start space-x-4">
        <Settings2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="font-bold text-gray-900">Randomness Note</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            This tool uses the standard JavaScript <code>Math.random()</code> function, which is suitable for most general purposes like giveaways, games, and basic sampling. For cryptographic security, specialized hardware or APIs are recommended.
          </p>
        </div>
      </div>
    </div>
  );
}
