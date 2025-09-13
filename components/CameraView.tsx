import React, { useRef, useEffect, useState, useCallback } from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões no seu navegador.");
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    }
  }, [onCapture]);

  if (error) {
    return <div className="flex items-center justify-center h-full p-4 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="relative h-full w-full bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      
      {/* AR Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-11/12 max-w-md h-28">
          {/* Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg animate-pulse-corners"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg animate-pulse-corners"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg animate-pulse-corners"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg animate-pulse-corners"></div>
          
          {/* Scanning Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full shadow-[0_0_10px_1px_#60a5fa] animate-scan"></div>
        </div>
        <p className="text-white mt-4 text-center bg-black/50 px-4 py-1 rounded">Posicione a placa na área demarcada</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
        <button
          onClick={handleCaptureClick}
          className="h-20 w-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-400/50 shadow-lg transition-transform transform active:scale-90"
          aria-label="Capturar Imagem"
        >
          <CameraIcon className="h-10 w-10 text-gray-800" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;