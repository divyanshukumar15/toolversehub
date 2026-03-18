import React, { useState, useCallback } from 'react';
import { Copy, Trash2, Download, Check, Scissors, AlignLeft, Type, FileText, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RemoveExtraSpaces() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    removeAllExtraSpaces: true,
    removeAllLineBreaks: false,
    trimEachLine: true,
  });
  const [copied, setCopied] = useState(false);

  const handleClean = useCallback(() => {
    let result = input;

    if (options.trimEachLine) {
      result = result
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
    }

    if (options.removeAllLineBreaks) {
      result = result.replace(/\r?\n|\r/g, ' ');
    }

    if (options.removeAllExtraSpaces) {
      // Collapse multiple spaces into one
      result = result.replace(/[ \t]+/g, ' ');
      // Also handle multiple newlines if not removing all line breaks
      if (!options.removeAllLineBreaks) {
        result = result.replace(/\n\s*\n/g, '\n\n');
      }
    }

    // Always trim the overall result
    setOutput(result.trim());
  }, [input, options]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>Input Text</span>
            </label>
            <span className="text-xs text-gray-500">{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your messy text here..."
            className="w-full h-48 p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all outline-none resize-none font-mono text-sm"
          />
        </div>

        {/* Options Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 mb-2">
            <Scissors className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Cleaning Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={options.removeAllExtraSpaces}
                onChange={(e) => setOptions({ ...options, removeAllExtraSpaces: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Collapse Spaces</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={options.removeAllLineBreaks}
                onChange={(e) => setOptions({ ...options, removeAllLineBreaks: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Remove Line Breaks</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={options.trimEachLine}
                onChange={(e) => setOptions({ ...options, trimEachLine: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Trim Each Line</span>
            </label>
          </div>

          <button
            onClick={handleClean}
            disabled={!input}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
          >
            <Scissors className="w-5 h-5" />
            <span>Clean Text</span>
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
              <AlignLeft className="w-4 h-4 text-indigo-600" />
              <span>Cleaned Output</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-30"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-30"
                title="Download as .txt"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative group">
            <textarea
              readOnly
              value={output}
              placeholder="Cleaned text will appear here..."
              className="w-full h-48 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-0 transition-all outline-none resize-none font-mono text-sm text-gray-700"
            />
            {output && (
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                {output.length} characters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>How it works</span>
          </h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
              <span><strong>Collapse Spaces:</strong> Turns multiple spaces or tabs into a single space.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
              <span><strong>Remove Line Breaks:</strong> Joins all lines into a single paragraph.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
              <span><strong>Trim Each Line:</strong> Removes leading and trailing whitespace from every individual line.</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Privacy & Security</span>
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your text is processed entirely within your browser. We never send your content to any server, 
            ensuring your sensitive data remains 100% private and secure. This tool works offline once loaded 
            and is perfect for cleaning up code, documents, or creative writing.
          </p>
        </div>
      </div>
    </div>
  );
}
