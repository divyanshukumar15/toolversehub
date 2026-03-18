import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Trash2, Plus, AlertCircle } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  date: string;
}

export default function ExamCountdown() {
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('exam-countdown-list');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('exam-countdown-list', JSON.stringify(exams));
  }, [exams]);

  const addExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDate) return;
    const newExam: Exam = {
      id: Date.now().toString(),
      name: newName,
      date: newDate,
    };
    setExams([...exams, newExam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewName('');
    setNewDate('');
  };

  const removeExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const getTimeRemaining = (targetDate: string) => {
    const total = Date.parse(targetDate) - now.getTime();
    if (total <= 0) return null;

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Add Exam Form */}
      <form onSubmit={addExam} className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-xl shadow-indigo-500/5 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-indigo-600" />
          Add New Exam or Event
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Exam Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Final Mathematics"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Exam Date & Time</label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Add to Countdown
        </button>
      </form>

      {/* Exam List */}
      <div className="grid grid-cols-1 gap-6">
        {exams.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No exams added yet. Start by adding one above!</p>
          </div>
        ) : (
          exams.map((exam) => {
            const remaining = getTimeRemaining(exam.date);
            const isPast = !remaining;

            return (
              <div 
                key={exam.id}
                className={`p-8 rounded-3xl border-2 transition-all ${
                  isPast ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-indigo-50 shadow-lg shadow-indigo-500/5'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-gray-900">{exam.name}</h4>
                    <p className="text-gray-500 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(exam.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeExam(exam.id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {isPast ? (
                  <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                    <Trophy className="w-5 h-5" />
                    <span>Exam Completed!</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Days', value: remaining.days },
                      { label: 'Hours', value: remaining.hours },
                      { label: 'Mins', value: remaining.minutes },
                      { label: 'Secs', value: remaining.seconds },
                    ].map((unit) => (
                      <div key={unit.label} className="bg-indigo-50 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-black text-indigo-600 tabular-nums">{unit.value}</div>
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{unit.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Info */}
      <div className="flex items-start space-x-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">Privacy Note</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            Your exam dates are stored locally in your browser's storage. We don't save any of your personal data on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
