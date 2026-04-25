import math, random, os, time
from datetime import datetime, timezone, timedelta
import requests

class SatelliteService:
    """Fetches real EO features from Copernicus Data Space (Sentinel Hub API) or falls back to synthetic."""

    def __init__(self):
        self.use_real = os.getenv("USE_REAL_COPERNICUS", "false").lower() == "true"
        self.client_id = os.getenv("COPERNICUS_CLIENT_ID")
        self.client_secret = os.getenv("COPERNICUS_CLIENT_SECRET")
        self.token = None
        self.token_expiry = 0

    def _get_token(self) -> str:
        if self.token and time.time() < self.token_expiry:
            return self.token

        url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
        payload = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        resp = requests.post(url, data=payload)
        resp.raise_for_status()
        data = resp.json()
        self.token = data["access_token"]
        self.token_expiry = time.time() + data.get("expires_in", 3600) - 60
        return self.token

    def _fetch_real_data(self, lat: float, lon: float) -> dict:
        token = self._get_token()
        url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"

        # Bounding box ~200m around the point
        bbox_deg = 0.002 
        bbox = [lon - bbox_deg, lat - bbox_deg, lon + bbox_deg, lat + bbox_deg]

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=14)
        time_from = start_date.strftime("%Y-%m-%dT00:00:00Z")
        time_to = end_date.strftime("%Y-%m-%dT23:59:59Z")

        evalscript = """
        //VERSION=3
        function setup() {
            return {
                input: ["B03", "B04", "B08", "CLP", "dataMask"],
                output: [
                    { id: "ndwi", bands: 1 },
                    { id: "turb", bands: 1 },
                    { id: "chl", bands: 1 },
                    { id: "cloud", bands: 1 },
                    { id: "dataMask", bands: 1 }
                ]
            };
        }
        function evaluatePixel(sample) {
            let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08 + 0.0001);
            let turb = sample.B04;
            let chl = sample.B04 / (sample.B03 + 0.0001);
            return {
                ndwi: [ndwi],
                turb: [turb],
                chl: [chl],
                cloud: [sample.CLP / 255.0],
                dataMask: [sample.dataMask]
            };
        }
        """

        payload = {
            "input": {
                "bounds": {"bbox": bbox, "properties": {"crs": "http://www.opengis.net/def/crs/EPSG/0/4326"}},
                "data": [{"type": "sentinel-2-l2a", "dataFilter": {"timeRange": {"from": time_from, "to": time_to}, "maxCloudCoverage": 80}}]
            },
            "aggregation": {
                "timeRange": {"from": time_from, "to": time_to},
                "aggregationInterval": {"of": "P14D"},
                "evalscript": evalscript,
                "resx": 10, "resy": 10
            }
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        resp = requests.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()["data"][0]["outputs"]

        ndwi_mean = data["ndwi"]["bands"]["B0"]["stats"]["mean"]
        turb_proxy = data["turb"]["bands"]["B0"]["stats"]["mean"]
        chl_proxy = data["chl"]["bands"]["B0"]["stats"]["mean"]
        cloud_mean = data["cloud"]["bands"]["B0"]["stats"]["mean"]

        return {
            "ndwi": round(ndwi_mean, 3),
            "turbidity_ntu": round(max(1.0, turb_proxy * 200), 1),
            "chlorophyll_a_mg_m3": round(max(0.2, chl_proxy * 15), 1),
            "tsm_mg_l": round(max(1.0, turb_proxy * 250), 1),
            "cloud_probability": round(cloud_mean, 2),
            "source_freshness_hours": 24 
        }

    def fetch_features(self, lat: float, lon: float, water_type: str = "lake") -> dict:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        seed = hash((round(lat, 3), round(lon, 3), today, water_type)) & 0xffffffff
        rng = random.Random(seed)

        urban_pressure = min(1.0, abs(math.sin(lat * 2.1) + math.cos(lon * 1.7)) / 2)
        river_penalty = 1.15 if water_type == "river" else 0.9
        seasonal = 0.5 + 0.5 * math.sin(datetime.now().timetuple().tm_yday / 365 * 2 * math.pi)

        features = {}

        if self.use_real and self.client_id:
            try:
                real_data = self._fetch_real_data(lat, lon)
                features.update(real_data)
                features["cdom_absorption"] = round(max(0.01, rng.gauss(0.4 + urban_pressure * 1.3, 0.25)), 2)
            except Exception as e:
                print(f"Warning: Failed to fetch real Copernicus data: {e}. Falling back to synthetic.")

        if not features:
            turbidity = max(1, rng.gauss(8 + 28 * urban_pressure * river_penalty, 6))
            chl = max(0.2, rng.gauss(3 + 22 * seasonal * urban_pressure, 4))
            tsm = max(1, turbidity * rng.uniform(0.7, 1.8))
            cloud = max(0, min(1, rng.betavariate(2, 5)))
            ndwi = max(-0.4, min(0.9, rng.gauss(0.42 - 0.18 * urban_pressure, 0.08)))

            features.update({
                "ndwi": round(ndwi, 3),
                "turbidity_ntu": round(turbidity, 1),
                "chlorophyll_a_mg_m3": round(chl, 1),
                "tsm_mg_l": round(tsm, 1),
                "cdom_absorption": round(max(0.01, rng.gauss(0.4 + urban_pressure * 1.3, 0.25)), 2),
                "cloud_probability": round(cloud, 2),
                "source_freshness_hours": rng.randint(3, 72),
            })

        temp = rng.gauss(16 + 10 * seasonal, 2)
        temp_anom = rng.gauss((seasonal - 0.5) * 3, 1.2)
        no2 = max(0, rng.gauss(0.00005 + urban_pressure * 0.00018, 0.00004))
        so2 = max(0, rng.gauss(0.000005 + urban_pressure * 0.00004, 0.00001))

        features.update({
            "water_temperature_c": round(temp, 1),
            "temperature_anomaly_c": round(temp_anom, 1),
            "no2_mol_m2": round(no2, 7),
            "so2_mol_m2": round(so2, 7),
        })

        return features
