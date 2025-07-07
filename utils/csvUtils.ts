export function escapeCsvValue(value: number | string): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Getallen krijgen geen extra quotes
  if (typeof value === 'number') {
    return String(value);
  }

  let stringValue = String(value);

  stringValue = stringValue.replace(/"/g, '""');

  // Tekstwaarden krijgen extra quotes
  return `"${stringValue}"`;
}