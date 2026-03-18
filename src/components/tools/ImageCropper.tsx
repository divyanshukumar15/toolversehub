import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Upload, Download, Crop, RefreshCw, Image as ImageIcon, CheckCircle2, AlertCircle, Maximize } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [croppedSize, setCroppedSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setError(null);
      setFileName(file.name);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<{ url: string; size: number } | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const url = URL.createObjectURL(blob);
        resolve({ url, size: blob.size });
      }, 'image/png');
    });
  };

  const showCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const result = await getCroppedImg(image, croppedAreaPixels);
      if (result) {
        setCroppedImage(result.url);
        setCroppedSize(result.size);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCroppedImage = () => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.download = `cropped-${fileName}`;
    link.href = croppedImage;
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
    setCroppedImage(null);
    setFileName('');
    setOriginalSize(0);
    setCroppedSize(0);
    setOriginalDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="space-y-8">
      {!image ? (
        <div 
          onClick={() => document.getElementById('crop-upload')?.click()}
          className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
        >
          <input 
            id="crop-upload"
            type="file" 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload image to crop</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Drag and drop or click to select an image.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cropper Area */}
          <div className="space-y-6">
            <div className="relative h-[400px] bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={undefined}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Maximize className="w-5 h-5 mr-2 text-indigo-600" />
                  Crop Controls
                </h3>
                <button onClick={reset} className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" /> Reset
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-gray-700">
                  <span>Zoom</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Original Size</p>
                  <p className="text-sm font-bold text-gray-900">{originalDimensions.width}x{originalDimensions.height}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(originalSize)}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Crop Area</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {croppedAreaPixels ? `${Math.round(croppedAreaPixels.width)}x${Math.round(croppedAreaPixels.height)}` : '0x0'}
                  </p>
                </div>
              </div>

              <button
                onClick={showCroppedImage}
                disabled={isProcessing}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Crop className="w-5 h-5 mr-2" />}
                Apply Crop
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Cropped Preview
            </h3>
            
            <div className="aspect-square bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center relative group">
              {croppedImage ? (
                <img src={croppedImage} alt="Cropped" className="max-w-full max-h-full object-contain shadow-2xl" />
              ) : (
                <div className="text-center p-8">
                  <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crop className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Apply crop to see preview</p>
                </div>
              )}
            </div>

            {croppedImage && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Image cropped successfully!</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700/60 uppercase tracking-widest">
                    {formatFileSize(croppedSize)}
                  </p>
                </div>

                <button 
                  onClick={downloadCroppedImage}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Cropped Image
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
    </div>
  );
}
