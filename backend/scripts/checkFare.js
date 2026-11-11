// Prueba rápida de calculateFare con el ejemplo del PDF (sección 5).
// Uso: node backend/scripts/checkFare.js
import { calculateFare } from '../../src/utils/calculateFare.js';

const cases = [
  { name: 'Económico 8,5 km 22 min', input: { distanceKm: 8.5, durationMin: 22, category: 'economy' }, expected: { fare: 19200, commission: 3840, driverEarnings: 15360 } },
  { name: 'XL 8,5 km 22 min', input: { distanceKm: 8.5, durationMin: 22, category: 'xl' }, expected: { fare: 26900, commission: 5380, driverEarnings: 21520 } },
  { name: 'Viaje corto -> tarifa mínima', input: { distanceKm: 0.5, durationMin: 2, category: 'economy' }, expected: { fare: 6000, commission: 1200, driverEarnings: 4800 } },
  { name: 'Propina va completa al conductor', input: { distanceKm: 8.5, durationMin: 22, category: 'economy', tip: 2000 }, expected: { fare: 19200, commission: 3840, driverEarnings: 17360 } },
];

let failed = 0;
for (const { name, input, expected } of cases) {
  const result = calculateFare(input);
  const ok = Object.keys(expected).every((key) => result[key] === expected[key]);
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${name}:`, result);
}
console.log(failed === 0 ? '\nTodas las pruebas pasaron' : `\n${failed} prueba(s) fallaron`);
process.exit(failed === 0 ? 0 : 1);