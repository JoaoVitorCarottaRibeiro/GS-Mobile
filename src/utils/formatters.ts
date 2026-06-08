export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatKm(km: number): string {
  if (km >= 1_000_000) return `${formatNumber(km / 1_000_000, 2)} mi km`;
  if (km >= 1_000) return `${formatNumber(km / 1_000, 1)} mil km`;
  return `${formatNumber(km, 0)} km`;
}

export function formatVelocity(kmh: string): string {
  const num = parseFloat(kmh);
  if (num >= 1_000) return `${formatNumber(num / 1_000, 1)} mil km/h`;
  return `${formatNumber(num, 0)} km/h`;
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + '…';
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDatePlusdays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
