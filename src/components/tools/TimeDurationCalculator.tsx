import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, Timer, History } from 'lucide-react';

export default function TimeDurationCalculator() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, totalMinutes: 0 });

  useEffect(() => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    let diff = end.getTime() - start.getTime();
    if (diff < 0) diff = 0;

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    setDuration({ hours, minutes, totalMinutes });
  }, [startTime, endTime, startDate, endDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Start Time
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-xl"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-emerald-600" />
              End Time
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-xl"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 space-y-8">
            <div className="space-y-2">
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Total Duration</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl font-black">{duration.hours}</span>
                <span className="text-2xl font-bold text-gray-400">h</span>
                <span className="text-6xl font-black">{duration.minutes}</span>
                <span className="text-2xl font-bold text-gray-400">m</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Minutes</span>
                <div className="text-xl font-bold">{duration.totalMinutes.toLocaleString()} min</div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Seconds</span>
                <div className="text-xl font-bold">{(duration.totalMinutes * 60).toLocaleString()} sec</div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-4">
            <h4 className="font-bold text-indigo-900 flex items-center">
              <Timer className="w-5 h-5 mr-2" />
              Usage Examples
            </h4>
            <ul className="text-sm text-indigo-700 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <span>Calculate work shift hours</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <span>Track study session duration</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                <span>Measure flight or travel time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
