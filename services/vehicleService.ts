
import { VehicleInfo, VehicleStatusType } from '../types';

const MOCK_DATA = {
  models: ['Fiat Argo', 'Hyundai HB20', 'Chevrolet Onix', 'Jeep Renegade', 'VW T-Cross', 'Toyota Corolla', 'Honda Civic'],
  colors: ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul'],
  cities: ['São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Curitiba - PR', 'Porto Alegre - RS'],
};

// Simple hash function to make mock data deterministic
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getVehicleInfo = (plate: string): VehicleInfo => {
  const hash = simpleHash(plate);

  const statusSeed = hash % 10;
  let status: VehicleStatusType;
  let message: string;

  if (statusSeed < 7) { // 70% chance of being regular
    status = VehicleStatusType.REGULAR;
    message = 'Veículo em situação regular. Nenhuma restrição encontrada.';
  } else if (statusSeed < 9) { // 20% chance of having debts
    status = VehicleStatusType.DEBTS;
    message = 'Constam débitos de IPVA e multas para este veículo. Recomenda-se a quitação.';
  } else { // 10% chance of theft
    status = VehicleStatusType.THEFT;
    message = 'ALERTA: Consta registro de roubo ou furto para este veículo. Contate as autoridades imediatamente.';
  }

  return {
    plate,
    model: MOCK_DATA.models[hash % MOCK_DATA.models.length],
    year: 2018 + (hash % 6), // Year between 2018 and 2023
    color: MOCK_DATA.colors[hash % MOCK_DATA.colors.length],
    city: MOCK_DATA.cities[hash % MOCK_DATA.cities.length],
    status,
    message,
  };
};
