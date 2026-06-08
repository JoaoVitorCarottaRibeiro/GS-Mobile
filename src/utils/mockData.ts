import { City, Simulation } from '../types/cityorbit';

export const MOCK_CITIES: City[] = [
  { id: '1', name: 'São Paulo',       state: 'SP', country: 'Brasil', lidar: true,  satelliteRes: '0.5m', lat: -23.55, lon: -46.64, simulationCount: 5 },
  { id: '2', name: 'Rio de Janeiro',  state: 'RJ', country: 'Brasil', lidar: false, satelliteRes: '1m',   lat: -22.91, lon: -43.17, simulationCount: 3 },
  { id: '3', name: 'Curitiba',        state: 'PR', country: 'Brasil', lidar: true,  satelliteRes: '0.5m', lat: -25.43, lon: -49.27, simulationCount: 2 },
  { id: '4', name: 'Brasília',        state: 'DF', country: 'Brasil', lidar: false, satelliteRes: '2m',   lat: -15.78, lon: -47.93, simulationCount: 2 },
  { id: '5', name: 'Salvador',        state: 'BA', country: 'Brasil', lidar: false, satelliteRes: '1m',   lat: -12.97, lon: -38.51, simulationCount: 1 },
];

const sp  = MOCK_CITIES[0];
const rj  = MOCK_CITIES[1];
const cwb = MOCK_CITIES[2];
const bsb = MOCK_CITIES[3];
const ssa = MOCK_CITIES[4];

export const MOCK_SIMULATIONS: Simulation[] = [
  {
    id: '1', city: sp,  type: 'FLOOD',        status: 'COMPLETED',
    riskScore: 82, nasaData: true,  createdAt: '2026-06-01',
    description: 'Simulação de enchente na bacia do Tietê com dados NASA POWER.',
  },
  {
    id: '2', city: sp,  type: 'TRAFFIC',      status: 'COMPLETED',
    riskScore: 47, nasaData: false, createdAt: '2026-06-02',
    description: 'Impacto no tráfego da Av. Paulista durante horário de pico.',
  },
  {
    id: '3', city: rj,  type: 'HEAT_ISLAND',  status: 'PROCESSING',
    riskScore: undefined, nasaData: true, createdAt: '2026-06-04',
    description: 'Mapeamento de ilhas de calor na Zona Norte do Rio.',
  },
  {
    id: '4', city: cwb, type: 'CONSTRUCTION', status: 'PENDING',
    riskScore: undefined, nasaData: false, createdAt: '2026-06-05',
    description: 'Análise de impacto de obra na linha 2 do metrô de Curitiba.',
  },
  {
    id: '5', city: sp,  type: 'HEAT_ISLAND',  status: 'FAILED',
    riskScore: undefined, nasaData: true, createdAt: '2026-06-03',
    description: 'Erro ao consultar NASA POWER API. Reprocessar.',
  },
  {
    id: '6', city: bsb, type: 'FLOOD',        status: 'COMPLETED',
    riskScore: 31, nasaData: true,  createdAt: '2026-05-28',
    description: 'Risco de alagamento no Lago Paranoá após chuvas intensas.',
  },
  {
    id: '7', city: rj,  type: 'TRAFFIC',      status: 'COMPLETED',
    riskScore: 65, nasaData: false, createdAt: '2026-05-30',
    description: 'Colapso viário na Av. Brasil durante obras do BRT.',
  },
  {
    id: '8', city: ssa, type: 'CONSTRUCTION', status: 'PENDING',
    riskScore: undefined, nasaData: false, createdAt: '2026-06-06',
    description: 'Expansão do porto de Salvador — análise de impacto urbano.',
  },
];

export function getDashboardStats() {
  const completed = MOCK_SIMULATIONS.filter(s => s.status === 'COMPLETED');
  const withRisk  = completed.filter(s => s.riskScore !== undefined);
  const avgRisk   = withRisk.length
    ? Math.round(withRisk.reduce((acc, s) => acc + s.riskScore!, 0) / withRisk.length)
    : 0;
  return {
    totalCities:      MOCK_CITIES.length,
    totalSimulations: MOCK_SIMULATIONS.length,
    completed:        completed.length,
    avgRisk,
  };
}
