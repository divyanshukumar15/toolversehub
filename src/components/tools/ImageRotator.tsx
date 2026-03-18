import React, { useState, useRef } from 'react';
import { RotateCw, RotateCcw, Download, Image as ImageIcon, Trash2, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function ImageRotator() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotate = (dir: 'cw' | 'ccw') => {
    setRotation(prev => (dir === 'cw' ? prev + 90 : prev - 90));
  };

  const downloadImage = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const isVertical = (rotation / 90) % 2 !== 0;
      canvas.width = isVertical ? img.height : img.width;
      canvas.height = isVertical ? img.width : img.height;

      ctx?.save();
      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate((rotation * Math.PI) / 180);
      ctx?.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);
      ctx?.restore();

      const link = document.createElement('a');
      link.download = 'rotated-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const clearImage = () => {
    setImage(null);
    setRotation(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-96 bg-gray-50 border-4 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300"
        >
          <div className="p-6 bg-white rounded-3xl shadow-xl shadow-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
            <ImageIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="mt-6 text-center">
            <p className="text-xl font-black text-gray-900">Upload Image to Rotate</p>
            <p className="text-gray-500 mt-2">Click to browse or drag and drop</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Preview Area */}
          <div className="relative bg-gray-50 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px] overflow-hidden border-2 border-gray-100">
            <div 
              className="transition-all duration-300 ease-out shadow-2xl shadow-black/10"
              style={{ 
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                maxWidth: '100%',
              }}
            >
              <img src={image} alt="Preview" className="max-h-[500px] rounded-lg" />
            </div>
            
            <button 
              onClick={clearImage}
              className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md text-red-500 rounded-2xl shadow-lg hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => rotate('ccw')}
                className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex flex-col items-center justify-center space-y-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">-90°</span>
              </button>
              <button
                onClick={() => rotate('cw')}
                className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex flex-col items-center justify-center space-y-2"
              >
                <RotateCw className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">+90°</span>
              </button>
              <button
                onClick={() => setFlipH(!flipH)}
                className={`p-4 border-2 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 ${
                  flipH ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-100 hover:border-indigo-500'
                }`}
              >
                <FlipHorizontal className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Flip H</span>
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`p-4 border-2 rounded-2xl transition-all flex flex-col items-center justify-center space-y-2 ${
                  flipV ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-100 hover:border-indigo-500'
                }`}
              >
                <FlipVertical className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Flip V</span>
              </button>
            </div>

            <button
              onClick={downloadImage}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Rotated Image</span>
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
