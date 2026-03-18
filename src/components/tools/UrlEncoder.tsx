import React, { useState } from 'react';
import { Link, Link2Off, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (err) {
      setOutput('Error encoding URL');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (err) {
      setOutput('Error decoding URL. Make sure it is a valid encoded string.');
    }
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

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 block">Input Text / URL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your URL or text here..."
            className="w-full h-48 p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-indigo-500 outline-none transition-all resize-none font-mono text-lg"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleEncode}
            className="flex-1 min-w-[150px] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
          >
            <Link className="w-5 h-5" />
            <span>Encode URL</span>
          </button>
          <button
            onClick={handleDecode}
            className="flex-1 min-w-[150px] py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
          >
            <Link2Off className="w-5 h-5" />
            <span>Decode URL</span>
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">Result</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="w-full min-h-[150px] p-6 bg-indigo-50 border-2 border-indigo-100 rounded-3xl font-mono text-lg break-all text-indigo-900">
            {output || <span className="text-indigo-300 italic">Result will appear here...</span>}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 text-indigo-600" />
            Why use URL Encoding?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            URL encoding converts characters into a format that can be transmitted over the Internet. 
            URLs can only be sent over the Internet using the ASCII character-set. 
            Since URLs often contain characters outside the ASCII set, the URL has to be converted into a valid ASCII format.
          </p>
        </div>
      </div>
    </div>
  );
}
