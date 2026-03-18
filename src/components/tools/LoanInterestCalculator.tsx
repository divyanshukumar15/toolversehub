import React, { useState, useEffect } from 'react';
import { Calculator, Percent, RefreshCw, Clock, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function LoanInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(500000);
  const [rate, setRate] = useState<number>(10);
  const [time, setTime] = useState<number>(5);
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('compound');
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12); // Monthly by default

  const [interest, setInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, interestType, compoundingFrequency]);

  const calculateInterest = () => {
    const p = principal;
    const r = rate / 100;
    const t = time;

    if (interestType === 'simple') {
      const i = p * r * t;
      setInterest(i);
      setTotalAmount(p + i);
    } else {
      const n = compoundingFrequency;
      const amount = p * Math.pow(1 + r / n, n * t);
      setInterest(amount - p);
      setTotalAmount(amount);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const reset = () => {
    setPrincipal(500000);
    setRate(10);
    setTime(5);
    setInterestType('compound');
    setCompoundingFrequency(12);
  };

  const chartData = [
    { name: 'Principal', value: principal },
    { name: 'Total Interest', value: interest },
  ];

  const COLORS = ['#6366f1', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
              Loan Parameters
            </h3>
            <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-gray-200 rounded-2xl">
              <button
                onClick={() => setInterestType('simple')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${interestType === 'simple' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Simple Interest
              </button>
              <button
                onClick={() => setInterestType('compound')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${interestType === 'compound' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Compound Interest
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Principal Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
              <input
                type="range"
                min={1000}
                max={10000000}
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Interest Rate (% p.a)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Percent className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Time Period (Years)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {interestType === 'compound' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Compounding Frequency</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value={12}>Monthly (12 times/year)</option>
                  <option value={4}>Quarterly (4 times/year)</option>
                  <option value={2}>Half-Yearly (2 times/year)</option>
                  <option value={1}>Yearly (1 time/year)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Total Interest</p>
              <h4 className="text-3xl font-black text-emerald-900">{formatCurrency(interest)}</h4>
            </div>
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Total Amount</p>
              <h4 className="text-3xl font-black text-indigo-900">{formatCurrency(totalAmount)}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Interest vs Principal
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900">Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  With a principal of {formatCurrency(principal)} at {rate}% interest for {time} years, 
                  you will pay a total of <span className="font-bold text-indigo-600">{formatCurrency(interest)}</span> in interest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
