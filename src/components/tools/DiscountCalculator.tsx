import React, { useState, useEffect } from 'react';
import { Tag, Percent, ArrowDown, ShoppingBag } from 'lucide-react';

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>('1000');
  const [discountPercent, setDiscountPercent] = useState<string>('20');
  const [taxPercent, setTaxPercent] = useState<string>('0');
  const [savings, setSavings] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const discount = parseFloat(discountPercent) || 0;
    const tax = parseFloat(taxPercent) || 0;

    const discountAmt = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmt;
    const taxAmt = (priceAfterDiscount * tax) / 100;
    const total = priceAfterDiscount + taxAmt;

    setSavings(discountAmt);
    setTaxAmount(taxAmt);
    setFinalPrice(total);
  }, [originalPrice, discountPercent, taxPercent]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2 text-indigo-600" />
              Original Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full p-4 pl-10 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Percent className="w-4 h-4 mr-2 text-emerald-600" />
                Discount (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-600" />
                Tax (%)
              </label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg"
                placeholder="0"
              />
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-700 font-bold">You Save</span>
              <span className="text-2xl font-black text-indigo-600">₹{savings.toLocaleString()}</span>
            </div>
            <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${Math.min(parseFloat(discountPercent) || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-indigo-400">Price Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-400">
                <span>Original Price</span>
                <span className="font-bold">₹{(parseFloat(originalPrice) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span className="flex items-center">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  Discount ({discountPercent}%)
                </span>
                <span className="font-bold">-₹{savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Tax ({taxPercent}%)</span>
                <span className="font-bold">+₹{taxAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Final Price</div>
            <div className="text-5xl font-black text-white">
              ₹{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
