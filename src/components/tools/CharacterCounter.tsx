import React, { useState } from 'react';

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const stats = {
    total: text.length,
    noSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split(/\n/).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Characters', value: stats.total },
          { label: 'Without Spaces', value: stats.noSpaces },
          { label: 'Words', value: stats.words },
          { label: 'Lines', value: stats.lines },
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
    </div>
  );
}
