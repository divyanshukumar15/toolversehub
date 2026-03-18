import React, { useState } from 'react';

export default function CaseConverter() {
  const [text, setText] = useState('');

  const convert = (type: string) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title': setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())); break;
      case 'sentence': setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())); break;
      default: break;
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        className="w-full h-64 p-6 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all shadow-inner text-gray-700 leading-relaxed"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-wrap gap-4">
        <button onClick={() => convert('upper')} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">UPPERCASE</button>
        <button onClick={() => convert('lower')} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">lowercase</button>
        <button onClick={() => convert('title')} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Title Case</button>
        <button onClick={() => convert('sentence')} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Sentence case</button>
        <button onClick={() => setText('')} className="px-6 py-2 text-red-500 font-medium hover:text-red-700 transition-colors ml-auto">Clear</button>
      </div>
    </div>
  );
}
