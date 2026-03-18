import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, FileText, Clock, Check, Copy } from 'lucide-react';

export default function OnlineNotepad() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('online-notepad-content') || '';
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('online-notepad-content', content);
      setLastSaved(new Date());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  const downloadNote = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `note-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearNote = () => {
    if (window.confirm('Are you sure you want to clear your note? This cannot be undone.')) {
      setContent('');
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900">My Quick Note</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadNote}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={clearNote}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your notes here... Your work is automatically saved locally."
          className="w-full h-[500px] p-8 bg-white border-2 border-gray-100 rounded-[2.5rem] focus:border-indigo-500 outline-none transition-all resize-none text-xl leading-relaxed shadow-xl shadow-indigo-500/5"
        />
        
        {/* Status Bar */}
        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full border border-gray-100">
          <div className="flex items-center space-x-6">
            <span>{wordCount} Words</span>
            <span>{charCount} Characters</span>
          </div>
          {lastSaved && (
            <div className="flex items-center space-x-1 text-emerald-500">
              <Clock className="w-3 h-3" />
              <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
        <p className="text-sm text-indigo-700 leading-relaxed text-center">
          <strong>Privacy First:</strong> This notepad works entirely in your browser. Your notes are stored in your local storage and never sent to any server.
        </p>
      </div>
    </div>
  );
}
