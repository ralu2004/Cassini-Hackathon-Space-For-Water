import json, math
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "water_bodies.json"

class GeoService:
    def __init__(self):
        self.water_bodies = json.loads(DATA_PATH.read_text())

    @staticmethod
    def haversine_km(lat1, lon1, lat2, lon2):
        r = 6371.0
        p1, p2 = math.radians(lat1), math.radians(lat2)
        dp = math.radians(lat2 - lat1)
        dl = math.radians(lon2 - lon1)
        a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
        return 2 * r * math.atan2(math.sqrt(a), math.sqrt(1-a))

    def nearest_water_body(self, lat: float, lon: float):
        best = min(self.water_bodies, key=lambda wb: self.haversine_km(lat, lon, wb["lat"], wb["lon"]))
        result = dict(best)
        result["distance_km"] = round(self.haversine_km(lat, lon, best["lat"], best["lon"]), 2)
        return result

    def reverse_geocode_mock(self, lat: float, lon: float) -> str:
        nearest = self.nearest_water_body(lat, lon)
        if nearest["distance_km"] < 30:
            return f"Near {nearest['name']}"
        return f"Lat {lat:.3f}, Lon {lon:.3f}"
