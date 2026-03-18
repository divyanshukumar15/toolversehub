import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, CheckCircle2, AlertCircle, FileImage } from 'lucide-react';

export default function JpgToPng() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/image\/jpe?g/)) {
        setError('Please upload a valid JPG/JPEG image.');
        return;
      }
      setError(null);
      setFileName(file.name);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setDimensions({ width: img.width, height: img.height });
          setConvertedImage(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToPng = () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setConvertedImage(url);
          setConvertedSize(blob.size);
        }
        setIsProcessing(false);
      }, 'image/png');
    }, 100);
  };

  const downloadPng = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}.png`;
    link.href = convertedImage;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    setImage(null);
    setConvertedImage(null);
    setFileName('');
    setOriginalSize(0);
    setConvertedSize(0);
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
            accept="image/jpeg,image/jpg"
          />
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload JPG Image</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Select a JPG or JPEG file to convert to PNG format.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FileImage className="w-5 h-5 mr-2 text-indigo-600" />
                Conversion Settings
              </h3>
              <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Filename</span>
                <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{fileName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Resolution</span>
                <span className="text-sm font-bold text-gray-900">{dimensions.width}x{dimensions.height}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Original Size</span>
                <span className="text-sm font-bold text-gray-900">{formatFileSize(originalSize)}</span>
              </div>
            </div>

            <button 
              onClick={convertToPng}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Convert to PNG
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
              PNG Preview
            </h3>
            
            <div className="aspect-square bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center relative group">
              {convertedImage ? (
                <img src={convertedImage} alt="Converted" className="max-w-full max-h-full object-contain shadow-2xl" />
              ) : (
                <div className="text-center p-8">
                  <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileImage className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Click convert to see preview</p>
                </div>
              )}
            </div>

            {convertedImage && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Converted successfully!</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700/60 uppercase tracking-widest">
                    PNG Size: {formatFileSize(convertedSize)}
                  </p>
                </div>

                <button 
                  onClick={downloadPng}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PNG
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
