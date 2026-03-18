import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, Volume2, Hash } from 'lucide-react';

const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

export default function NumberToWords() {
  const [input, setInput] = useState('1234');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertToWords = (numStr: string): string => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return '';
    if (num === 0) return 'zero';

    const convertChunk = (n: number): string => {
      let chunk = '';
      if (n >= 100) {
        chunk += units[Math.floor(n / 100)] + ' hundred ';
        n %= 100;
      }
      if (n >= 10 && n <= 19) {
        chunk += teens[n - 10] + ' ';
      } else if (n >= 20) {
        chunk += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0 && n < 10) {
        chunk += units[n] + ' ';
      }
      return chunk.trim();
    };

    let words = '';
    let n = num;
    let scaleIdx = 0;

    while (n > 0) {
      const chunk = n % 1000;
      if (chunk > 0) {
        const chunkWords = convertChunk(chunk);
        words = chunkWords + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : '') + ' ' + words;
      }
      n = Math.floor(n / 1000);
      scaleIdx++;
    }

    return words.trim();
  };

  useEffect(() => {
    setOutput(convertToWords(input));
  }, [input]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(output);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Input */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 block">Enter Number</label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Hash className="w-6 h-6" />
            </div>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-8 pl-20 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-indigo-500 outline-none font-black text-4xl tracking-tight"
              placeholder="0"
            />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">In Words</label>
            <div className="flex space-x-2">
              <button
                onClick={speak}
                className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                title="Listen"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
          <div className="w-full min-h-[200px] p-10 bg-white border-2 border-indigo-100 rounded-[2.5rem] text-3xl font-bold text-indigo-900 leading-tight capitalize shadow-xl shadow-indigo-500/5 flex items-center justify-center text-center">
            {output || <span className="text-indigo-200 italic">Enter a number...</span>}
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Type className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900">Why use Number to Words?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              This tool is perfect for writing checks, legal documents, or formal letters where numbers must be spelled out to prevent ambiguity. It supports numbers up to trillions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
