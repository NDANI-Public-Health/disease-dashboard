import { CaseRecord } from '../../../shared/types';

const countries = [
  'Nigeria', 'DRC', 'Ethiopia', 'Tanzania', 'Kenya',
  'Ghana', 'Cameroon', 'Mozambique', 'Uganda', 'Mali',
  'Burkina Faso', 'Niger'
];

const diseases = [
  'Malaria',
  'Lymphatic Filariasis',
  'Schistosomiasis',
  'Onchocerciasis',
  'Soil-transmitted Helminthiasis'
];

const populations: Record<string, number> = {
  'Nigeria': 223800000,
  'DRC': 102300000,
  'Ethiopia': 126500000,
  'Tanzania': 65500000,
  'Kenya': 55100000,
  'Ghana': 33500000,
  'Cameroon': 28600000,
  'Mozambique': 33900000,
  'Uganda': 48600000,
  'Mali': 22600000,
  'Burkina Faso': 22700000,
  'Niger': 26200000,
};

const years = [2019, 2020, 2021, 2022, 2023, 2024];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMockData(): CaseRecord[] {
  const records: CaseRecord[] = [];
  let id = 1;
  let seed = 42;

  for (const country of countries) {
    for (const disease of diseases) {
      // Not every country-disease-year combo exists (skip ~30%)
      const skip = seededRandom(seed++) > 0.7;
      if (skip) continue;

      for (const year of years) {
        // Skip some years randomly
        if (seededRandom(seed++) > 0.8) continue;

        const pop = populations[country];
        let baseCases: number;

        switch (disease) {
          case 'Malaria':
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.05);
            break;
          case 'Lymphatic Filariasis':
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.008);
            break;
          case 'Schistosomiasis':
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.015);
            break;
          case 'Onchocerciasis':
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.005);
            break;
          case 'Soil-transmitted Helminthiasis':
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.02);
            break;
          default:
            baseCases = Math.floor(pop * seededRandom(seed++) * 0.01);
        }

        const cases = Math.max(100, baseCases);
        const deathRate = disease === 'Malaria' ? 0.002 : 0.0005;
        const deaths = Math.floor(cases * deathRate * (0.5 + seededRandom(seed++)));
        const prevalence = parseFloat(((cases / pop) * 100).toFixed(4));

        records.push({
          id: id++,
          country,
          disease,
          year,
          cases,
          deaths,
          population: pop,
          prevalence,
        });
      }
    }
  }

  return records;
}

export const mockData = generateMockData();
export { countries, diseases };
