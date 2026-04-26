from datetime import datetime, timedelta, timezone
import random
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import *
from app.services.geo_service import GeoService
from app.services.satellite_service import SatelliteService
from app.services.wqi_service import WQIService
from app.services.offline_maps_service import OfflineMapsService

router = APIRouter()
geo = GeoService()
sat = SatelliteService()
wqi_service = WQIService()
offline_maps = OfflineMapsService()

@router.get("/location")
def location(lat: float = Query(...), lon: float = Query(...)):
    nearest = geo.nearest_water_body(lat, lon)
    return {"coordinates": {"lat": lat, "lon": lon}, "location_label": geo.reverse_geocode_mock(lat, lon), "nearest_water_body": nearest, "gnss_mode": "Galileo-like high accuracy simulated"}

@router.get("/water-quality", response_model=WaterQualityResponse)
def water_quality(lat: float = Query(...), lon: float = Query(...)):
    nearest = geo.nearest_water_body(lat, lon)
    features = sat.fetch_features(nearest["lat"], nearest["lon"], nearest["type"])
    score, explanations = wqi_service.compute_wqi(features)
    class_name, drinkability, color, recommendation = wqi_service.classify(score)
    confidence = max(0.55, min(0.97, 0.92 - features["cloud_probability"] * 0.25 - min(nearest["distance_km"], 40) / 400))
    return WaterQualityResponse(
        coordinates=Coordinates(lat=lat, lon=lon),
        location_label=geo.reverse_geocode_mock(lat, lon),
        nearest_water_body=WaterBody(**nearest),
        wqi=score,
        class_name=class_name,
        drinkability=drinkability,
        color=color,
        confidence=round(confidence, 2),
        features=SatelliteFeatures(**features),
        explanations=explanations[:5],
        recommendation=recommendation,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )

@router.post("/risk-analysis", response_model=RiskAnalysisResponse)
def risk_analysis(req: RiskRequest):
    data = water_quality(req.lat, req.lon)
    warnings = []
    if data.wqi < 75: warnings.append(data.recommendation)
    if data.features.turbidity_ntu > 20: warnings.append("High turbidity can hide pathogens and reduce disinfection effectiveness.")
    if data.features.chlorophyll_a_mg_m3 > 20: warnings.append("Possible algal bloom signal detected from Sentinel-style features.")
    actions = ["Use a 0.1–0.2 µm filter", "Boil for at least 1 minute", "Use chemical disinfection after filtering", "Check upstream pollution sources"]
    return RiskAnalysisResponse(risk_level=data.class_name, score=data.wqi, warnings=warnings or ["No major satellite-derived warning."], safe_actions=actions, why=data.explanations)

@router.get("/historical-trends", response_model=HistoricalTrendsResponse)
def historical_trends(lat: float = Query(...), lon: float = Query(...)):
    nearest = geo.nearest_water_body(lat, lon)
    rng = random.Random(hash(nearest["id"]) & 0xffffffff)
    points = []
    base = rng.randint(55, 85)
    slope = rng.choice([-1, 1]) * rng.uniform(0.2, 1.3)
    for i in range(14):
        day = datetime.now(timezone.utc).date() - timedelta(days=(13 - i) * 3)
        score = int(max(20, min(98, base + slope * i + rng.gauss(0, 4))))
        turb = max(1, 55 - score * 0.45 + rng.gauss(0, 3))
        chl = max(0.3, 42 - score * 0.36 + rng.gauss(0, 2))
        points.append(TrendPoint(date=day.isoformat(), wqi=score, turbidity_ntu=round(turb, 1), chlorophyll_a_mg_m3=round(chl, 1)))
    direction = "improving" if points[-1].wqi > points[0].wqi + 4 else "worsening" if points[-1].wqi < points[0].wqi - 4 else "stable"
    return HistoricalTrendsResponse(water_body_id=nearest["id"], direction=direction, points=points)


@router.get("/offline-maps", response_model=OfflineMapsResponse)
def list_offline_maps():
    data = offline_maps.list_regions()
    return OfflineMapsResponse(
        regions=[OfflineMapRegion(**r) for r in data["regions"]]
    )


@router.post("/offline-maps/{region_id}/toggle", response_model=OfflineMapsResponse)
def toggle_offline_map_region(region_id: str):
    try:
        data = offline_maps.toggle(region_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    return OfflineMapsResponse(
        regions=[OfflineMapRegion(**r) for r in data["regions"]]
    )
