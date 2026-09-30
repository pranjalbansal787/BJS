/** Money is stored in paise; everything user-facing goes through here. */
export function formatInr(minor: number): string {
  const rupees = Math.round(minor / 100);
  const digits = String(Math.abs(rupees));
  let out: string;
  if (digits.length > 3) {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    out = `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}`;
  } else {
    out = digits;
  }
  return `${rupees < 0 ? '-' : ''}₹${out}`;
}

export function rupeesToMinor(value: string | number): number {
  const n = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.]/g, ''));
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

export function minorToRupees(minor: number): number {
  return Math.round(minor / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}
