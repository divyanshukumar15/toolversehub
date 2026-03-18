import React, { useState, useEffect } from 'react';
import { Copy, Check, Palette, RefreshCw } from 'lucide-react';

export default function RgbToHex() {
  const [r, setR] = useState(79);
  const [g, setG] = useState(70);
  const [b, setB] = useState(229);
  const [hex, setHex] = useState('#4f46e5');
  const [copied, setCopied] = useState<string | null>(null);

  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  useEffect(() => {
    setHex(rgbToHex(r, g, b));
  }, [r, g, b]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (/^#?[0-9A-F]{6}$/i.test(val)) {
      const rgb = hexToRgb(val);
      if (rgb) {
        setR(rgb.r);
        setG(rgb.g);
        setB(rgb.b);
      }
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const randomize = () => {
    setR(Math.floor(Math.random() * 256));
    setG(Math.floor(Math.random() * 256));
    setB(Math.floor(Math.random() * 256));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Red (R)</label>
                <span className="text-sm font-mono text-indigo-600 font-bold">{r}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={r}
                onChange={(e) => setR(parseInt(e.target.value))}
                className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Green (G)</label>
                <span className="text-sm font-mono text-emerald-600 font-bold">{g}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={g}
                onChange={(e) => setG(parseInt(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Blue (B)</label>
                <span className="text-sm font-mono text-blue-600 font-bold">{b}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={b}
                onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">HEX Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={hex}
                  onChange={handleHexChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg focus:border-indigo-500 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(hex, 'hex')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600"
                >
                  {copied === 'hex' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">RGB Code</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={`rgb(${r}, ${g}, ${b})`}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono font-bold text-lg outline-none"
                />
                <button
                  onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`, 'rgb')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600"
                >
                  {copied === 'rgb' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={randomize}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Random Color</span>
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div 
            className="w-full h-64 rounded-3xl shadow-2xl shadow-indigo-500/20 border-8 border-white transition-colors duration-200"
            style={{ backgroundColor: hex }}
          />
          
          <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-indigo-600" />
              Color Information
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Luminance:</span>
                <span className="font-mono font-bold">{(0.299 * r + 0.587 * g + 0.114 * b).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Contrast:</span>
                <span className="font-mono font-bold">{(0.299 * r + 0.587 * g + 0.114 * b) > 128 ? 'Dark Text' : 'Light Text'}</span>
              </div>
              <p className="mt-4 leading-relaxed">
                Convert RGB values to Hexadecimal color codes instantly. Perfect for web designers and developers who need quick color translations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
