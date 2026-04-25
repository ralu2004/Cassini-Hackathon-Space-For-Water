# Terra Sip — Smart Water Quality Detection MVP

Mobile-first prototype that uses high-accuracy browser geolocation, a mock Copernicus/Galileo processing pipeline, and a FastAPI backend to classify nearby water as SAFE / CAUTION / UNSAFE.

## Why these EO sources
- Sentinel-2 MSI is suitable for high-resolution water-quality indicators such as chlorophyll-a, turbidity, CDOM, DOC, and water color.
- Sentinel-3 measures ocean/land colour and sea/land surface temperature, useful for water colour and temperature anomaly signals.
- Sentinel-5P provides atmospheric pollution products such as NO2 and SO2, used here as contextual pollution proxies.

This MVP uses deterministic synthetic data so the demo works without API keys. Replace `SatelliteService.fetch_features()` with Copernicus Data Space, Sentinel Hub, or CLMS Lake Water Quality calls later.

## Folder structure
```txt
terra-sip/
  backend/
    app/api/routes.py
    app/services/{geo_service,satellite_service,wqi_service}.py
    app/models/schemas.py
    app/data/water_bodies.json
    train_model.py
    requirements.txt
  frontend/
    src/App.jsx
    src/components/*
    src/lib/api.js
  docker-compose.yml
```

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## API examples
```bash
curl "http://localhost:8000/water-quality?lat=46.77&lon=23.59"
curl "http://localhost:8000/historical-trends?lat=46.77&lon=23.59"
```

## Docker
```bash
docker compose up --build
```

Backend: http://localhost:8000  
Frontend: http://localhost:5173

## WQI logic
Weighted score from 0–100:
- 75–100: SAFE / GOOD
- 50–74: CAUTION / FAIR
- 0–49: UNSAFE / POOR

Penalties come from turbidity, chlorophyll-a, TSM, NDWI confidence, temperature anomaly, NO2/SO2 proxies, and cloud uncertainty.

## Replace mock satellite data later
In `backend/app/services/satellite_service.py`, replace the synthetic generator with:
1. Sentinel-2 MSI water mask + turbidity/chlorophyll/TSM retrieval
2. Sentinel-3 OLCI water colour + temperature product lookup
3. Sentinel-5P NO2/SO2 contextual pollution lookup
4. Spatial/temporal resampling to nearest water body
5. Store in PostGIS for real geo queries
