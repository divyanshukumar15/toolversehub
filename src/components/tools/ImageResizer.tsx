import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Maximize2, RefreshCw, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ImageResizer() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetDimensions, setTargetDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [resizedFileSize, setResizedFileSize] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      
      setError(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setOriginalDimensions({ width: img.width, height: img.height });
          setTargetDimensions({ width: img.width, height: img.height });
          setAspectRatio(img.width / img.height);
          setResizedImage(null);
          setResizedFileSize(0);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 0;
    if (lockAspectRatio) {
      const height = Math.round(width / aspectRatio);
      setTargetDimensions({ width, height });
    } else {
      setTargetDimensions(prev => ({ ...prev, width }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 0;
    if (lockAspectRatio) {
      const width = Math.round(height * aspectRatio);
      setTargetDimensions({ width, height });
    } else {
      setTargetDimensions(prev => ({ ...prev, height }));
    }
  };

  const resizeImage = () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = targetDimensions.width;
      canvas.height = targetDimensions.height;

      // Use better scaling quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(image, 0, 0, targetDimensions.width, targetDimensions.height);

      // Default to PNG for quality, or JPG if user preferred (sticking to PNG as it was before)
      const dataUrl = canvas.toDataURL('image/png');
      setResizedImage(dataUrl);
      
      // Calculate approximate file size from base64
      const stringLength = dataUrl.split(',')[1].length;
      const sizeInBytes = Math.floor(stringLength * (3 / 4));
      setResizedFileSize(sizeInBytes);
      
      setIsProcessing(false);
    }, 100);
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.download = `resized-image-${targetDimensions.width}x${targetDimensions.height}.png`;
    link.href = resizedImage;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setResizedImage(null);
    setResizedFileSize(0);
    setFileName('');
    setOriginalDimensions({ width: 0, height: 0 });
    setTargetDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload your image</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Drag and drop your image here, or click to browse. Supports PNG, JPG, WEBP.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Maximize2 className="w-5 h-5 mr-2 text-indigo-600" />
                Resize Options
              </h3>
              <button 
                onClick={reset}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Width (px)</label>
                <input 
                  type="number" 
                  value={targetDimensions.width}
                  onChange={handleWidthChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Height (px)</label>
                <input 
                  type="number" 
                  value={targetDimensions.height}
                  onChange={handleHeightChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={lockAspectRatio}
                  onChange={(e) => setLockAspectRatio(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-10 h-6 rounded-full transition-colors",
                  lockAspectRatio ? "bg-indigo-600" : "bg-gray-300"
                )}></div>
                <div className={cn(
                  "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                  lockAspectRatio ? "translate-x-4" : "translate-x-0"
                )}></div>
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                Lock Aspect Ratio
              </span>
            </label>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Original</span>
                <span>{originalDimensions.width} x {originalDimensions.height} px</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <span>Target</span>
                <span>{targetDimensions.width} x {targetDimensions.height} px</span>
              </div>
            </div>

            <button 
              onClick={resizeImage}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Preview'
              )}
            </button>
          </div>

          {/* Preview Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Preview
            </h3>
            
            <div className="aspect-square bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center relative group">
              {resizedImage ? (
                <img 
                  src={resizedImage} 
                  alt="Resized Preview" 
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Click "Generate Preview" to see the result</p>
                </div>
              )}
            </div>

            {resizedImage && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Image resized successfully!</span>
                  </div>
                  <div className="flex space-x-4 text-xs font-bold text-emerald-700/60 uppercase tracking-widest">
                    <span>{targetDimensions.width} x {targetDimensions.height} PX</span>
                    <span>{formatFileSize(resizedFileSize)}</span>
                  </div>
                </div>

                <button 
                  onClick={downloadImage}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resized Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
