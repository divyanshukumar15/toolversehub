import React, { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');

  const generate = () => {
    let charset = '';
    if (options.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(res);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="text-sm font-bold text-gray-400 uppercase mb-2">Generated Password</div>
        <div className="p-6 bg-gray-50 rounded-2xl text-2xl font-mono break-all text-indigo-600 border-2 border-dashed border-indigo-100">
          {password || 'Click Generate'}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">Password Length: {length}</label>
          </div>
          <input 
            type="range" min="8" max="64" value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(options).map(([key, val]) => (
            <label key={key} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" checked={val} 
                onChange={() => setOptions({...options, [key]: !val})}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-bold text-gray-700 capitalize">{key}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={generate}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Generate Secure Password
        </button>
      </div>
    </div>
  );
}
