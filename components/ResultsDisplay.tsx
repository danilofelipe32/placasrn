
import React from 'react';
import { VehicleInfo, VehicleStatusType } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface ResultsDisplayProps {
  plate: string | null;
  vehicleInfo: VehicleInfo | null;
  error: string | null;
  scannedImage: string | null;
  onReset: () => void;
}

const statusStyles = {
  [VehicleStatusType.REGULAR]: {
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    icon: <CheckCircleIcon className="w-6 h-6" />
  },
  [VehicleStatusType.DEBTS]: {
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    icon: <ExclamationTriangleIcon className="w-6 h-6" />
  },
  [VehicleStatusType.THEFT]: {
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    icon: <XCircleIcon className="w-6 h-6" />
  },
};

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plate, vehicleInfo, error, onReset, scannedImage }) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 p-4 pt-8 overflow-y-auto">
      <div className="flex-grow">
        {scannedImage && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <img src={scannedImage} alt="Placa escaneada" className="w-full h-auto" />
          </div>
        )}

        {error && !vehicleInfo && (
          <div className="text-center p-6 bg-red-500/10 rounded-lg border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-2">Falha na Leitura</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {vehicleInfo && (
          <>
            <div className="text-center mb-6">
              <span className="text-gray-400 text-sm">Placa Identificada</span>
              <h1 className="text-5xl font-bold tracking-widest bg-gray-800 p-3 rounded-lg border-2 border-gray-600 inline-block my-2">
                {vehicleInfo.plate}
              </h1>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-300">Situação do Veículo</h3>
              <div className={`flex items-center p-3 rounded-lg border ${statusStyles[vehicleInfo.status].borderColor} ${statusStyles[vehicleInfo.status].bgColor}`}>
                  <div className={`mr-3 ${statusStyles[vehicleInfo.status].textColor}`}>
                    {statusStyles[vehicleInfo.status].icon}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${statusStyles[vehicleInfo.status].textColor}`}>{vehicleInfo.status}</p>
                    <p className="text-sm text-gray-400">{vehicleInfo.message}</p>
                  </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
               <h3 className="text-lg font-semibold mb-1 text-gray-300">Dados do Veículo</h3>
              <InfoRow label="Modelo" value={vehicleInfo.model} />
              <InfoRow label="Ano" value={vehicleInfo.year} />
              <InfoRow label="Cor" value={vehicleInfo.color} />
              <InfoRow label="Cidade/UF" value={vehicleInfo.city} />
               <p className="text-xs text-center text-gray-500 mt-4">* As informações do veículo são simuladas para fins de demonstração.</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform active:scale-95 shadow-lg"
        >
          Escanear Nova Placa
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
