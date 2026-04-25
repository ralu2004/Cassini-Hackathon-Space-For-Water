# TerraSip

**From space to your next sip.**  
See your world from above - decide what is safe below.

TerraSip is a hackathon MVP that turns satellite-derived water signals into a simple safety experience for end users. It combines:

- a FastAPI backend that computes a Water Quality Index (WQI),
- a mobile-first React frontend with map, scan, details, and bottle views,
- mock Copernicus/Galileo-style data to run fully without external API keys.

## What is in the app

- **Map tab**: current source, WQI status, and nearby-water context.
- **Scan tab**: bottle-like scan interaction with live scan state.
- **Details tab**: water explanation breakdown, warnings, and recommendation.
- **Bottle tab**: link/unlink bottle state and simulated live telemetry (fill level, temperature, conductivity, battery).
- **Project tab**: hackathon narrative and impact framing.

## Tech stack

- **Backend**: FastAPI, Pydantic, deterministic mock EO features.
- **Frontend**: React + Vite + Tailwind + Leaflet.
- **Data**: local JSON water bodies with Romanian diacritics preserved via UTF-8 loading.

## EO data rationale (mocked in MVP)

- **Sentinel-2 MSI**: chlorophyll-a, turbidity, TSM, NDWI-like water presence indicators.
- **Sentinel-3 OLCI**: water colour and temperature context.
- **Sentinel-5P**: atmospheric NO2/SO2 proxy contribution.

The current implementation uses synthetic deterministic values for demo reliability. Replace the synthetic generator in `backend/app/services/satellite_service.py` when integrating real data providers.

## Local run

### 1) Backend
```bash
cd backend
python -m venv .venv
```

Activate venv:

- **Windows (PowerShell)**:
```powershell
.\.venv\Scripts\Activate.ps1
```

- **macOS/Linux**:
```bash
source .venv/bin/activate
```

Install and run:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend docs: `http://localhost:8000/docs`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend app: `http://localhost:5173`

Optional environment override:
```bash
cp .env.example .env
```
Set `VITE_API_BASE_URL` if backend is not running at `http://127.0.0.1:8000`.

## API quick examples

```bash
curl "http://localhost:8000/water-quality?lat=46.77&lon=23.59"
curl "http://localhost:8000/historical-trends?lat=46.77&lon=23.59"
curl -X POST "http://localhost:8000/risk-analysis" -H "Content-Type: application/json" -d "{\"lat\":46.77,\"lon\":23.59}"
```

## WQI ranges

- `75-100`: Excellent / Safe
- `50-74`: Good / Treat before drinking
- `25-49`: Poor / Not recommended
- `0-24`: Unsafe / Do not drink

Score penalties consider turbidity, chlorophyll-a, suspended matter, NDWI confidence, atmospheric pollution proxies, temperature anomaly, and cloud uncertainty.

## Docker

```bash
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Next integration step

To move beyond MVP mock data, replace `SatelliteService.fetch_features()` with real retrieval + resampling from Copernicus-compatible sources, then persist processed observations in a spatial database (for example PostGIS).
