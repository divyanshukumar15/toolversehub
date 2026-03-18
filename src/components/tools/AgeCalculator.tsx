import React, { useState } from 'react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto space-y-8">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Birth Date</label>
        <input
          type="date"
          className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <button 
        onClick={calculate}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
      >
        Calculate Age
      </button>

      {age && (
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{age.years}</div>
            <div className="text-xs text-gray-400 uppercase font-bold">Years</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{age.months}</div>
            <div className="text-xs text-gray-400 uppercase font-bold">Months</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{age.days}</div>
            <div className="text-xs text-gray-400 uppercase font-bold">Days</div>
          </div>
        </div>
      )}
    </div>
  );
}
