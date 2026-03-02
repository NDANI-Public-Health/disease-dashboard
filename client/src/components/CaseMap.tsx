import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { CaseRecord } from '../types';

interface CaseMapProps {
  cases: CaseRecord[];
}

// Approximate center coordinates for African countries
const countryCoords: Record<string, [number, number]> = {
  'Nigeria': [9.08, 7.49],
  'DRC': [-4.04, 21.76],
  'Ethiopia': [9.15, 40.49],
  'Tanzania': [-6.37, 34.89],
  'Kenya': [-0.02, 37.91],
  'Ghana': [7.95, -1.02],
  'Cameroon': [7.37, 12.35],
  'Mozambique': [-18.67, 35.53],
  'Uganda': [1.37, 32.29],
  'Mali': [17.57, -4.0],
  'Burkina Faso': [12.36, -1.52],
  'Niger': [17.61, 8.08],
};

export default function CaseMap({ cases }: CaseMapProps) {
  const countryTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const r of cases) {
      totals.set(r.country, (totals.get(r.country) || 0) + r.cases);
    }
    return totals;
  }, [cases]);

  const maxCases = Math.max(...countryTotals.values(), 1);

  return (
    <div className="chart-container">
      <h3>Geographic Distribution</h3>
      <div className="map-wrapper">
        <MapContainer
          center={[5, 20]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {[...countryTotals.entries()].map(([country, total]) => {
            const coords = countryCoords[country];
            if (!coords) return null;
            const radius = 8 + (total / maxCases) * 32;
            const opacity = 0.3 + (total / maxCases) * 0.5;
            return (
              <CircleMarker
                key={country}
                center={coords}
                radius={radius}
                pathOptions={{
                  fillColor: '#0779bf',
                  fillOpacity: opacity,
                  color: '#065f96',
                  weight: 1,
                }}
              >
                <Tooltip>
                  <strong>{country}</strong>
                  <br />
                  {total.toLocaleString()} total cases
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
