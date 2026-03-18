import React, { useState, useEffect } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n+/).filter(Boolean).length,
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime}m` },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl text-center shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      <textarea
        className="w-full h-64 p-6 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all shadow-inner text-gray-700 leading-relaxed"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-end space-x-4">
        <button 
          onClick={() => setText('')}
          className="px-6 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
        >
          Clear
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(text);
            alert('Text copied to clipboard!');
          }}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Copy Text
        </button>
      </div>
    </div>
  );
}
