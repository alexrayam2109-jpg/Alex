import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { PhotoAttachment } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: PhotoAttachment) => void;
}

export const PhotoCaptureModal: React.FC<Props> = ({ isOpen, onClose, onAddPhoto }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [useCamera, setUseCamera] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access camera. Please allow camera permissions or upload a photo.');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        setFileName(`camera_${Date.now()}.jpg`);
        stopCamera();
      }
    }
  };

  const handleSave = () => {
    if (!selectedImage) return;

    const newPhoto: PhotoAttachment = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dataUrl: selectedImage,
      fileName: fileName || 'photo_entry.jpg',
      caption: caption.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    onAddPhoto(newPhoto);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setSelectedImage(null);
    setFileName('');
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Attach Photo Evidence</h3>
              <p className="text-xs text-slate-500">Capture or upload site photo with timestamp</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Camera View */}
          {useCamera && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium shadow-lg flex items-center space-x-2 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-slate-700 text-white rounded-xl font-medium transition"
                >
                  Cancel Camera
                </button>
              </div>
            </div>
          )}

          {/* Selected Image Preview */}
          {!useCamera && selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center group">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 shadow transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Photo Caption / Location Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broken valve on line 3, leaking water"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Selector options if no image chosen */}
          {!useCamera && !selectedImage && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-400 rounded-xl transition text-slate-700 group cursor-pointer"
              >
                <div className="p-3 bg-sky-600 text-white rounded-full mb-3 shadow-sm group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">Take Photo</span>
                <span className="text-xs text-slate-500 mt-1">Use Device Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300 rounded-xl transition text-slate-700 group cursor-pointer"
              >
                <div className="p-3 bg-slate-700 text-white rounded-full mb-3 shadow-sm group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">Upload File</span>
                <span className="text-xs text-slate-500 mt-1">Select PNG/JPG Image</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100 space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedImage}
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm flex items-center space-x-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Attach Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
