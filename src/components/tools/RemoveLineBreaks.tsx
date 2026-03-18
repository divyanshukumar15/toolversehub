import React, { useState } from 'react';
import { Trash2, Copy, Check, Download, AlignLeft, RefreshCw } from 'lucide-react';

export default function RemoveLineBreaks() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [replaceWith, setReplaceWith] = useState(' '); // Default to space

  const processText = () => {
    if (!input) {
      setOutput('');
      return;
    }
    // Remove all line breaks and replace with specified character
    const result = input.replace(/\r?\n|\r/g, replaceWith);
    // Also collapse multiple spaces if replaceWith is a space
    const finalResult = replaceWith === ' ' ? result.replace(/\s+/g, ' ').trim() : result;
    setOutput(finalResult);
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
    element.download = 'cleaned-text.txt';
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
          <label className="text-sm font-bold text-gray-700 block">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text with line breaks here..."
            className="w-full h-64 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 outline-none transition-all resize-none text-lg"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-700">Replace breaks with:</span>
            <div className="flex bg-white p-1 rounded-xl border border-gray-200">
              {[
                { label: 'Space', value: ' ' },
                { label: 'Comma', value: ', ' },
                { label: 'None', value: '' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setReplaceWith(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    replaceWith === opt.value 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={processText}
            className="flex-1 min-w-[200px] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
          >
            <AlignLeft className="w-5 h-5" />
            <span>Remove Line Breaks</span>
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
              <label className="text-sm font-bold text-gray-700">Cleaned Text</label>
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
            <div className="w-full min-h-[150px] p-6 bg-white border-2 border-indigo-100 rounded-3xl text-lg text-gray-800 leading-relaxed">
              {output}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 space-y-4">
          <h3 className="text-xl font-bold text-indigo-900 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Why use this tool?
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Removing line breaks is essential when you want to convert multi-line text (like a list or a poem) into a single paragraph. This is particularly useful for formatting text for social media, cleaning up OCR results, or preparing data for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
