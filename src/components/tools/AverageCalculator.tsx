import React, { useState, useEffect } from 'react';
import { Hash, Plus, Trash2, Calculator, Info } from 'lucide-react';

export default function AverageCalculator() {
  const [input, setInput] = useState('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [stats, setStats] = useState({
    average: 0,
    sum: 0,
    count: 0,
    median: 0,
    min: 0,
    max: 0
  });

  useEffect(() => {
    // Parse input: split by comma, space, or newline
    const parsed = input
      .split(/[,\s\n]+/)
      .map(n => parseFloat(n))
      .filter(n => !isNaN(n));
    
    setNumbers(parsed);

    if (parsed.length > 0) {
      const sum = parsed.reduce((a, b) => a + b, 0);
      const avg = sum / parsed.length;
      const sorted = [...parsed].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      
      let median = 0;
      const mid = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        median = (sorted[mid - 1] + sorted[mid]) / 2;
      } else {
        median = sorted[mid];
      }

      setStats({
        average: avg,
        sum,
        count: parsed.length,
        median,
        min,
        max
      });
    } else {
      setStats({ average: 0, sum: 0, count: 0, median: 0, min: 0, max: 0 });
    }
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">Enter Numbers</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter numbers separated by commas, spaces, or new lines... (e.g. 10, 20, 30)"
              className="w-full h-64 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 outline-none transition-all resize-none text-lg font-bold"
            />
          </div>

          <button
            onClick={() => setInput('')}
            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 space-y-6">
            <div className="space-y-1">
              <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Average (Mean)</span>
              <div className="text-6xl font-black">{stats.average.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-indigo-500/50">
              <div className="space-y-1">
                <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Sum</span>
                <div className="text-xl font-bold">{stats.sum.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Count</span>
                <div className="text-xl font-bold">{stats.count}</div>
              </div>
              <div className="space-y-1">
                <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Median</span>
                <div className="text-xl font-bold">{stats.median.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Range (Min-Max)</span>
                <div className="text-xl font-bold">{stats.min} - {stats.max}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-start space-x-4">
            <Info className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900">Statistical Tip</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The <strong>average</strong> is the sum of all numbers divided by the count. The <strong>median</strong> is the middle value when the numbers are sorted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
