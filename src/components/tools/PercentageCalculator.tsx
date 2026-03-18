import React, { useState, useEffect } from 'react';
import { Calculator, Percent, RefreshCw, HelpCircle, TrendingUp, ArrowRight } from 'lucide-react';

export default function PercentageCalculator() {
  const [val1, setVal1] = useState<string>('20');
  const [val2, setVal2] = useState<string>('100');
  const [type, setType] = useState('basic');
  const [result, setResult] = useState<string>('0');

  useEffect(() => {
    calculate();
  }, [val1, val2, type]);

  const calculate = () => {
    const n1 = parseFloat(val1);
    const n2 = parseFloat(val2);
    if (isNaN(n1) || isNaN(n2)) {
      setResult('0');
      return;
    }

    let res = 0;
    switch (type) {
      case 'basic': 
        res = (n1 / 100) * n2;
        break;
      case 'increase': 
        res = ((n2 - n1) / n1) * 100;
        break;
      case 'what-is': 
        res = (n1 / n2) * 100;
        break;
      case 'decrease':
        res = n1 - (n1 * n2 / 100);
        break;
      default: 
        res = 0;
    }
    setResult(res.toFixed(2).replace(/\.00$/, ''));
  };

  const reset = () => {
    setVal1('');
    setVal2('');
    setResult('0');
  };

  const types = [
    { id: 'basic', label: 'X% of Y', desc: 'Find the value of a percentage' },
    { id: 'increase', label: '% Change', desc: 'Find increase/decrease between two values' },
    { id: 'what-is', label: 'X is what % of Y', desc: 'Find the percentage ratio' },
    { id: 'decrease', label: 'Discount', desc: 'Find final price after X% off Y' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
              Calculator Mode
            </h3>
            <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  type === t.id 
                    ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10' 
                    : 'bg-transparent border-transparent hover:bg-white/50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold ${type === t.id ? 'text-indigo-600' : 'text-gray-700'}`}>{t.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{t.desc}</p>
                  </div>
                  {type === t.id && <TrendingUp className="w-4 h-4 text-indigo-500" />}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {type === 'basic' ? 'Percentage (%)' : type === 'increase' ? 'Original Value' : type === 'what-is' ? 'Value X' : 'Original Price'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                    placeholder="0"
                  />
                  {type === 'basic' && <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {type === 'basic' ? 'Of Value' : type === 'increase' ? 'New Value' : type === 'what-is' ? 'Value Y' : 'Discount (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                    placeholder="0"
                  />
                  {type === 'decrease' && <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Result */}
        <div className="flex flex-col justify-center">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-500/5 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Percent className="w-32 h-32 text-indigo-600 rotate-12" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Calculated Result</p>
              <div className="flex items-center justify-center">
                <h2 className="text-7xl font-black text-indigo-600 tracking-tight">
                  {result}
                </h2>
                <span className="text-3xl font-bold text-indigo-300 ml-2">
                  {type === 'increase' || type === 'what-is' ? '%' : ''}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 relative z-10">
              <p className="text-gray-500 font-medium">
                {type === 'basic' && `${val1}% of ${val2} is ${result}`}
                {type === 'increase' && `The change from ${val1} to ${val2} is ${result}%`}
                {type === 'what-is' && `${val1} is ${result}% of ${val2}`}
                {type === 'decrease' && `Original price ${val1} with ${val2}% off is ${result}`}
              </p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-center space-x-3 text-indigo-600 relative z-10">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Accurate & Instant Calculation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
