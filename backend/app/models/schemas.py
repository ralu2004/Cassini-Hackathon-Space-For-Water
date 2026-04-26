from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class Coordinates(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

class SatelliteFeatures(BaseModel):
    ndwi: float
    turbidity_ntu: float
    chlorophyll_a_mg_m3: float
    tsm_mg_l: float
    cdom_absorption: float
    water_temperature_c: float
    temperature_anomaly_c: float
    no2_mol_m2: float
    so2_mol_m2: float
    cloud_probability: float
    source_freshness_hours: int

class WaterBody(BaseModel):
    id: str
    name: str
    type: str
    lat: float
    lon: float
    distance_km: float

class Explanation(BaseModel):
    reason: str
    impact: str
    severity: str

class WaterQualityResponse(BaseModel):
    coordinates: Coordinates
    location_label: str
    nearest_water_body: WaterBody
    wqi: int
    class_name: str
    drinkability: str
    color: str
    confidence: float
    features: SatelliteFeatures
    explanations: List[Explanation]
    recommendation: str
    generated_at: str

class RiskRequest(BaseModel):
    lat: float
    lon: float
    planned_use: str = "drinking"

class RiskAnalysisResponse(BaseModel):
    risk_level: str
    score: int
    warnings: List[str]
    safe_actions: List[str]
    why: List[Explanation]

class TrendPoint(BaseModel):
    date: str
    wqi: int
    turbidity_ntu: float
    chlorophyll_a_mg_m3: float

class HistoricalTrendsResponse(BaseModel):
    water_body_id: str
    direction: str
    points: List[TrendPoint]


class OfflineMapRegion(BaseModel):
    id: str
    name: str
    size_mb: int
    downloaded: bool


class OfflineMapsResponse(BaseModel):
    regions: List[OfflineMapRegion]
