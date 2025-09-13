
import React, { useState, useCallback } from 'react';
import { AppState, VehicleInfo } from './types';
import { readPlateFromImage } from './services/geminiService';
import { getVehicleInfo } from './services/vehicleService';
import CameraView from './components/CameraView';
import ResultsDisplay from './components/ResultsDisplay';
import CarIcon from './components/icons/CarIcon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [plate, setPlate] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedImage, setLastScannedImage] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageDataUrl: string) => {
    setAppState(AppState.LOADING);
    setLastScannedImage(imageDataUrl);
    setError(null);
    try {
      const detectedPlate = await readPlateFromImage(imageDataUrl);
      if (!detectedPlate) {
        setError('Nenhuma placa detectada. Tente novamente com uma imagem mais nítida.');
        setAppState(AppState.RESULTS);
        return;
      }
      
      setPlate(detectedPlate);
      const info = getVehicleInfo(detectedPlate);
      setVehicleInfo(info);
      setAppState(AppState.RESULTS);

    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao processar a imagem. Verifique sua conexão e tente novamente.');
      setAppState(AppState.RESULTS);
    }
  }, []);

  const reset = () => {
    setAppState(AppState.SCANNING);
    setPlate(null);
    setVehicleInfo(null);
    setError(null);
    setLastScannedImage(null);
  };
  
  const startScan = () => {
    setAppState(AppState.SCANNING);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <CarIcon className="w-24 h-24 text-blue-400 mb-6" />
            <h1 className="text-4xl font-bold mb-2">Placa Vision AI</h1>
            <p className="text-gray-400 mb-8 max-w-sm">Use a câmera do seu celular para escanear placas de veículos e consultar a situação legal (simulada).</p>
            <button
              onClick={startScan}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform active:scale-95 shadow-lg"
            >
              Escanear Placa
            </button>
          </div>
        );
      case AppState.SCANNING:
        return <CameraView onCapture={handleCapture} />;
      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg">Analisando imagem...</p>
          </div>
        );
      case AppState.RESULTS:
        return <ResultsDisplay
          plate={plate}
          vehicleInfo={vehicleInfo}
          error={error}
          onReset={reset}
          scannedImage={lastScannedImage}
        />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white font-sans antialiased overflow-hidden">
      <main className="h-full w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
