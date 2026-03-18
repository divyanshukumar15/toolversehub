import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Download, Type, List } from 'lucide-react';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function RandomTextGenerator() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = '';
    
    if (type === 'words') {
      result = Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
    } else if (type === 'sentences') {
      result = Array.from({ length: count }, () => {
        const wordCount = Math.floor(Math.random() * 10) + 5;
        const sentence = Array.from({ length: wordCount }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      }).join(' ');
    } else {
      result = Array.from({ length: count }, () => {
        const sentenceCount = Math.floor(Math.random() * 3) + 3;
        return Array.from({ length: sentenceCount }, () => {
          const wordCount = Math.floor(Math.random() * 10) + 5;
          const sentence = Array.from({ length: wordCount }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
          return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
        }).join(' ');
      }).join('\n\n');
    }
    
    setOutput(result);
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
    element.download = 'random-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Generate Type</label>
          <div className="flex bg-white p-1 rounded-xl border border-gray-200">
            {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  type === t ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 outline-none font-bold"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={generateText}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">Generated Text</label>
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
          <div className="w-full min-h-[300px] p-8 bg-white border-2 border-indigo-100 rounded-3xl text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
          <Type className="w-4 h-4 mr-2" />
          What is Lorem Ipsum?
        </h4>
        <p className="text-sm text-indigo-700 leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </p>
      </div>
    </div>
  );
}
