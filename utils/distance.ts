export function calculateEuclideanDistance(
  loc1: { longitude: number; latitude: number },
  loc2: { longitude: number; latitude: number }
): number {
  const dx = loc2.longitude - loc1.longitude;
  const dy = loc2.latitude - loc1.latitude;
  return Math.sqrt(dx * dx + dy * dy);
}