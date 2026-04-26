# TerraSip

**From space to your next sip.**  
See your world from above - decide what is safe below.

TerraSip is a hackathon MVP that turns satellite-derived water signals into a practical end-user water safety flow.

## What is in the app

- **Map tab**: geolocated source lookup, live WQI, and risk status.
- **Scan tab**: bottle-style scan interaction wired to live water-quality API results.
- **Details tab**: satellite indicators, inferred quality categories, warnings, and recommendations.
- **Alerts tab**: generated alerts from risk + trends + current source context.
- **Offline Maps tab**: API-backed offline region list with toggle/persist behavior.
- **Bottle tab**: link/unlink state and simulated telemetry plus filter status panel.
- **Profile tab**: quick navigation to core product views.
- **Project tab**: challenge narrative and impact framing.

## Architecture

- **Backend**: FastAPI + Pydantic API layer with deterministic EO simulation and persisted offline-maps state.
- **Frontend**: React + Vite + Tailwind + Leaflet mobile-first UI.
- **Data**: local JSON water bodies (UTF-8 loaded, Romanian diacritics preserved).
- **State flow**: shared last-known coordinates are reused across Map, Scan, Details, Alerts, and Offline Maps to keep results consistent.

## EO data rationale (MVP mode)

- **Sentinel-2 MSI**: chlorophyll-a, turbidity, TSM, NDWI-like water presence indicators.
- **Sentinel-3 OLCI**: water color and temperature context.
- **Sentinel-5P**: atmospheric NO2/SO2 proxy contribution.

By default, values are deterministic synthetic outputs for demo reliability. Real Copernicus retrieval can be enabled/extended via `backend/app/services/satellite_service.py`.

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

## API endpoints (current)

- `GET /health`
- `GET /location?lat=...&lon=...`
- `GET /water-quality?lat=...&lon=...`
- `POST /risk-analysis` with JSON `{ "lat": ..., "lon": ... }`
- `GET /historical-trends?lat=...&lon=...`
- `GET /offline-maps`
- `POST /offline-maps/{region_id}/toggle`

Quick examples:

```bash
curl "http://localhost:8000/health"
curl "http://localhost:8000/water-quality?lat=46.77&lon=23.59"
curl -X POST "http://localhost:8000/risk-analysis" -H "Content-Type: application/json" -d "{\"lat\":46.77,\"lon\":23.59}"
curl "http://localhost:8000/historical-trends?lat=46.77&lon=23.59"
curl "http://localhost:8000/offline-maps"
curl -X POST "http://localhost:8000/offline-maps/carpathians/toggle"
```

## WQI ranges

- `75-100`: Excellent / Safe
- `50-74`: Good / Treat before drinking
- `25-49`: Poor / Not recommended
- `0-24`: Unsafe / Do not drink

Penalties consider turbidity, chlorophyll-a, suspended matter, NDWI confidence, atmospheric pollution proxies, temperature anomaly, and cloud uncertainty.

## Docker

```bash
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Next integration step

To move beyond MVP simulation, replace `SatelliteService.fetch_features()` with real retrieval + resampling from Copernicus-compatible sources and persist processed observations in a spatial store (e.g., PostGIS).
