import React, { useState, useEffect } from 'react';
import { Calculator, Percent, RefreshCw, Plus, Minus, Receipt, IndianRupee } from 'lucide-react';

export default function GstCalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const [gstAmount, setGstAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [baseAmount, setBaseAmount] = useState<number>(0);

  useEffect(() => {
    calculateGST();
  }, [amount, gstRate, mode]);

  const calculateGST = () => {
    if (mode === 'add') {
      const gst = (amount * gstRate) / 100;
      setGstAmount(gst);
      setFinalAmount(amount + gst);
      setBaseAmount(amount);
    } else {
      const base = amount / (1 + gstRate / 100);
      const gst = amount - base;
      setGstAmount(gst);
      setFinalAmount(amount);
      setBaseAmount(base);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const reset = () => {
    setAmount(1000);
    setGstRate(18);
    setMode('add');
  };

  const gstRates = [5, 12, 18, 28];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
              Tax Details
            </h3>
            <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-gray-200 rounded-2xl">
              <button
                onClick={() => setMode('add')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${mode === 'add' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Plus className="w-4 h-4 mr-2" /> Add GST
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${mode === 'remove' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Minus className="w-4 h-4 mr-2" /> Remove GST
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Amount (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">GST Rate (%)</label>
              <div className="grid grid-cols-4 gap-2">
                {gstRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all border ${gstRate === rate ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Percent className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  placeholder="Custom rate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-500/5 space-y-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center border-b border-gray-50 pb-4">
              <Receipt className="w-5 h-5 mr-2 text-indigo-600" />
              Tax Invoice Summary
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Base Amount</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(baseAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex flex-col">
                  <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">GST Amount ({gstRate}%)</span>
                  <span className="text-xs text-indigo-400 font-medium">CGST: {formatCurrency(gstAmount/2)} | SGST: {formatCurrency(gstAmount/2)}</span>
                </div>
                <span className="text-2xl font-black text-indigo-600">+{formatCurrency(gstAmount)}</span>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-black text-lg">Total Amount</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-900 block">{formatCurrency(finalAmount)}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed italic">
                * This calculation is based on standard GST rules. For businesses, please consult with a tax professional for exact filing requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
