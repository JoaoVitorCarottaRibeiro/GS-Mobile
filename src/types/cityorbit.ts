export type SimulationType = 'FLOOD' | 'TRAFFIC' | 'CONSTRUCTION' | 'HEAT_ISLAND';
export type SimulationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  lidar: boolean;
  satelliteRes?: string;
  lat: number;
  lon: number;
  simulationCount: number;
}

export interface Simulation {
  id: string;
  city: City;
  type: SimulationType;
  status: SimulationStatus;
  riskScore?: number;
  nasaData: boolean;
  createdAt: string;
  description: string;
}

export interface SimFavorite {
  id: string;
  simulationId: string;
  savedAt: string;
}

export const SIM_TYPE_META: Record<SimulationType, { label: string; icon: string; color: string }> = {
  FLOOD:        { label: 'Enchente',     icon: '🌊', color: '#3b82f6' },
  TRAFFIC:      { label: 'Tráfego',      icon: '🚗', color: '#f59e0b' },
  CONSTRUCTION: { label: 'Obra',         icon: '🏗️', color: '#eab308' },
  HEAT_ISLAND:  { label: 'Ilha de Calor',icon: '🌡️', color: '#ef4444' },
};

export const SIM_STATUS_META: Record<SimulationStatus, { label: string; color: string }> = {
  PENDING:    { label: 'Pendente',    color: '#f59e0b' },
  PROCESSING: { label: 'Processando', color: '#3b82f6' },
  COMPLETED:  { label: 'Completo',    color: '#10b981' },
  FAILED:     { label: 'Falhou',      color: '#ef4444' },
};

export function riskColor(score?: number): string {
  if (!score) return '#6b8db5';
  if (score >= 67) return '#ef4444';
  if (score >= 34) return '#f59e0b';
  return '#10b981';
}

export function riskLabel(score?: number): string {
  if (!score) return '—';
  if (score >= 67) return 'Alto';
  if (score >= 34) return 'Médio';
  return 'Baixo';
}
