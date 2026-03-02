# Disease Surveillance Dashboard

A full-stack monorepo for reporting disease cases across African countries. Built with an Express API (TypeScript) and a React dashboard (TypeScript + Vite), drawing visual inspiration from the WHO ESPEN dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express 4 + TypeScript + tsx |
| Frontend | React 18 + TypeScript + Vite |
| Charts | ApexCharts (react-apexcharts) |
| Map | Leaflet (react-leaflet) |
| Styling | Plain CSS (WHO-inspired blue theme) |

## Project Structure

```
disease-dashboard/
├── shared/          # Shared TypeScript types
├── server/          # Express API server
│   └── src/
│       ├── index.ts
│       ├── routes/cases.ts
│       └── data/mockData.ts
├── client/          # React dashboard
│   └── src/
│       ├── App.tsx
│       ├── components/
│       │   ├── Filters.tsx
│       │   ├── SummaryCards.tsx
│       │   ├── CaseChart.tsx
│       │   ├── CaseMap.tsx
│       │   ├── CaseTable.tsx
│       │   ├── OverviewTab.tsx
│       │   └── DataTab.tsx
│       └── hooks/
│           └── useDashboardData.ts
├── package.json     # npm workspaces root
└── tsconfig.base.json
```

## Dashboard Tabs

- **Overview** — Indicator definitions describing each metric used in the dashboard
- **Progress Dashboard** — Interactive charts, map, summary cards, and data table
- **Data** — Download link for the underlying dataset (placeholder)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/filters/countries` | List of available countries |
| `GET /api/filters/diseases` | List of available diseases |
| `GET /api/cases?country=&disease=` | Filtered case records |
| `GET /api/cases/summary?country=&disease=` | Aggregated summary stats |

## Mock Data

~200 records covering:
- **Countries**: Nigeria, DRC, Ethiopia, Tanzania, Kenya, Ghana, Cameroon, Mozambique, Uganda, Mali, Burkina Faso, Niger
- **Diseases**: Malaria, Lymphatic Filariasis, Schistosomiasis, Onchocerciasis, Soil-transmitted Helminthiasis
- **Years**: 2019–2024

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install

```bash
npm install
```

### Development

Starts the Express server on port 3001 and Vite dev server on port 5173:

```bash
npm run dev
```

Open http://localhost:5173 to view the dashboard.

### Production

Build the client and serve everything from the Express server:

```bash
npm run build
npm start
```

Open http://localhost:3001.

## License

ISC
