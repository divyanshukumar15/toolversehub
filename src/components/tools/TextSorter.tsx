import React, { useState } from 'react';
import { SortAsc, SortDesc, Trash2, Copy, Check, Download, ListOrdered } from 'lucide-react';

export default function TextSorter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  const sortText = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let lines = input.split(/\r?\n/).filter(line => line.trim() !== '');

    if (removeDuplicates) {
      lines = [...new Set(lines)];
    }

    lines.sort((a, b) => {
      const valA = caseSensitive ? a : a.toLowerCase();
      const valB = caseSensitive ? b : b.toLowerCase();
      
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setOutput(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'sorted-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Input Area */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 block">Input List (One item per line)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your list here..."
            className="w-full h-64 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 outline-none transition-all resize-none text-lg"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">Sort Order</label>
            <div className="flex bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setOrder('asc')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  order === 'asc' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SortAsc className="w-4 h-4" />
                <span>A-Z</span>
              </button>
              <button
                onClick={() => setOrder('desc')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  order === 'desc' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SortDesc className="w-4 h-4" />
                <span>Z-A</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${caseSensitive ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${caseSensitive ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Case Sensitive</span>
            </label>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${removeDuplicates ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${removeDuplicates ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">Remove Duplicates</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={sortText}
            className="flex-1 min-w-[200px] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
          >
            <ListOrdered className="w-5 h-5" />
            <span>Sort List Now</span>
          </button>
          <button
            onClick={clearAll}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Output Area */}
        {output && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Sorted List</label>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadText}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-64 p-6 bg-white border-2 border-indigo-100 rounded-3xl text-lg text-gray-800 leading-relaxed resize-none outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
