import React, { useState, useEffect } from 'react';
import { Calculator, CreditCard, Calendar, Percent, RefreshCw, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function EmiCalculator() {
  const [amount, setAmount] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(10);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    calculateEMI();
  }, [amount, rate, tenure, tenureType]);

  const calculateEMI = () => {
    const p = amount;
    const r = rate / 12 / 100;
    const n = tenureType === 'years' ? tenure * 12 : tenure;

    if (r === 0) {
      const emiVal = p / n;
      setEmi(emiVal);
      setTotalPayment(p);
      setTotalInterest(0);
      return;
    }

    const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiVal * n;
    const totalInt = totalPay - p;

    setEmi(emiVal);
    setTotalPayment(totalPay);
    setTotalInterest(totalInt);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const reset = () => {
    setAmount(1000000);
    setRate(8.5);
    setTenure(10);
    setTenureType('years');
  };

  const chartData = [
    { name: 'Principal Amount', value: amount },
    { name: 'Total Interest', value: totalInterest },
  ];

  const COLORS = ['#6366f1', '#f43f5e'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
              Loan Details
            </h3>
            <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Loan Amount</label>
                <span className="text-sm font-bold text-indigo-600">{formatCurrency(amount)}</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">₹</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Interest Rate (p.a)</label>
                <span className="text-sm font-bold text-indigo-600">{rate}%</span>
              </div>
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
              <input
                type="range"
                min={1}
                max={20}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Loan Tenure</label>
                <div className="flex bg-gray-200 p-1 rounded-lg">
                  <button
                    onClick={() => setTenureType('years')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${tenureType === 'years' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Years
                  </button>
                  <button
                    onClick={() => setTenureType('months')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${tenureType === 'months' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Months
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <input
                type="range"
                min={1}
                max={tenureType === 'years' ? 30 : 360}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Monthly EMI</p>
              <h4 className="text-2xl font-black text-indigo-900">{formatCurrency(emi)}</h4>
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-center">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">Total Interest</p>
              <h4 className="text-2xl font-black text-rose-900">{formatCurrency(totalInterest)}</h4>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Total Payment</p>
              <h4 className="text-2xl font-black text-emerald-900">{formatCurrency(totalPayment)}</h4>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Breakup of Total Payment
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
        </div>
      </div>
    </div>
  );
}
