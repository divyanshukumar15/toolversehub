import React, { useState, useEffect } from 'react';
import { Hash, Binary, ArrowRightLeft, Copy, Check } from 'lucide-react';

export default function BinaryConverter() {
  const [decimal, setDecimal] = useState('10');
  const [binary, setBinary] = useState('1010');
  const [hex, setHex] = useState('A');
  const [octal, setOctal] = useState('12');
  const [copied, setCopied] = useState<string | null>(null);

  const updateFromDecimal = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }
    setBinary(num.toString(2));
    setHex(num.toString(16).toUpperCase());
    setOctal(num.toString(8));
  };

  const updateFromBinary = (val: string) => {
    const num = parseInt(val, 2);
    if (isNaN(num)) {
      setDecimal('');
      setHex('');
      setOctal('');
      return;
    }
    setDecimal(num.toString(10));
    setHex(num.toString(16).toUpperCase());
    setOctal(num.toString(8));
  };

  const updateFromHex = (val: string) => {
    const num = parseInt(val, 16);
    if (isNaN(num)) {
      setDecimal('');
      setBinary('');
      setOctal('');
      return;
    }
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setOctal(num.toString(8));
  };

  const updateFromOctal = (val: string) => {
    const num = parseInt(val, 8);
    if (isNaN(num)) {
      setDecimal('');
      setBinary('');
      setHex('');
      return;
    }
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setHex(num.toString(16).toUpperCase());
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decimal */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center">
              <Hash className="w-4 h-4 mr-2 text-indigo-600" />
              Decimal (Base 10)
            </span>
            {decimal && (
              <button onClick={() => copyToClipboard(decimal, 'dec')} className="text-gray-400 hover:text-indigo-600">
                {copied === 'dec' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </label>
          <input
            type="text"
            value={decimal}
            onChange={(e) => {
              setDecimal(e.target.value);
              updateFromDecimal(e.target.value);
            }}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg focus:border-indigo-500 outline-none"
            placeholder="Enter decimal number..."
          />
        </div>

        {/* Binary */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center">
              <Binary className="w-4 h-4 mr-2 text-emerald-600" />
              Binary (Base 2)
            </span>
            {binary && (
              <button onClick={() => copyToClipboard(binary, 'bin')} className="text-gray-400 hover:text-indigo-600">
                {copied === 'bin' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </label>
          <input
            type="text"
            value={binary}
            onChange={(e) => {
              const val = e.target.value.replace(/[^01]/g, '');
              setBinary(val);
              updateFromBinary(val);
            }}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg focus:border-emerald-500 outline-none"
            placeholder="Enter binary number..."
          />
        </div>

        {/* Hexadecimal */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center">
              <ArrowRightLeft className="w-4 h-4 mr-2 text-blue-600" />
              Hexadecimal (Base 16)
            </span>
            {hex && (
              <button onClick={() => copyToClipboard(hex, 'hex')} className="text-gray-400 hover:text-indigo-600">
                {copied === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </label>
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
              setHex(val);
              updateFromHex(val);
            }}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg focus:border-blue-500 outline-none"
            placeholder="Enter hex number..."
          />
        </div>

        {/* Octal */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center">
              <Hash className="w-4 h-4 mr-2 text-orange-600" />
              Octal (Base 8)
            </span>
            {octal && (
              <button onClick={() => copyToClipboard(octal, 'oct')} className="text-gray-400 hover:text-indigo-600">
                {copied === 'oct' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </label>
          <input
            type="text"
            value={octal}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-7]/g, '');
              setOctal(val);
              updateFromOctal(val);
            }}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg focus:border-orange-500 outline-none"
            placeholder="Enter octal number..."
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center space-y-4">
        <h3 className="text-xl font-bold text-indigo-900">How it works</h3>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Number systems are different ways of representing values. Decimal is the standard system used by humans, while Binary is used by computers. Hexadecimal and Octal are often used in programming for more compact representations of binary data.
        </p>
      </div>
    </div>
  );
}
