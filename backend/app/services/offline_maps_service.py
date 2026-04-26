import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STATE_FILE = DATA_DIR / "offline_maps_state.json"

_DEFAULT = {
    "regions": [
        {"id": "alps", "name": "Swiss Alps Region", "size_mb": 12, "downloaded": True},
        {"id": "rocky", "name": "Rocky Mountains", "size_mb": 16, "downloaded": True},
        {"id": "pyrenees", "name": "Pyrenees", "size_mb": 9, "downloaded": True},
        {"id": "andes", "name": "Andes", "size_mb": 21, "downloaded": True},
        {"id": "carpathians", "name": "Carpathians", "size_mb": 14, "downloaded": False},
    ]
}


class OfflineMapsService:
    def __init__(self) -> None:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not STATE_FILE.exists():
            STATE_FILE.write_text(json.dumps(_DEFAULT, indent=2), encoding="utf-8")

    def _load(self) -> dict:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))

    def _save(self, data: dict) -> None:
        STATE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def list_regions(self) -> dict:
        return self._load()

    def toggle(self, region_id: str) -> dict:
        data = self._load()
        found = False
        for r in data["regions"]:
            if r["id"] == region_id:
                r["downloaded"] = not r["downloaded"]
                found = True
                break
        if not found:
            raise ValueError(f"Unknown region: {region_id}")
        self._save(data)
        return data
