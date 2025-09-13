
export enum AppState {
  WELCOME,
  SCANNING,
  LOADING,
  RESULTS,
}

export enum VehicleStatusType {
  REGULAR = 'Regular',
  THEFT = 'Roubo/Furto',
  DEBTS = 'Débitos Pendentes',
}

export interface VehicleInfo {
  plate: string;
  model: string;
  year: number;
  color: string;
  city: string;
  status: VehicleStatusType;
  message: string;
}
