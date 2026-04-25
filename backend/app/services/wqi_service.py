from app.models.schemas import Explanation

class WQIService:
    def compute_wqi(self, f: dict) -> tuple[int, list[Explanation]]:
        explanations = []
        score = 100.0

        def penalty(value, low, high, max_penalty, name, unit):
            nonlocal score
            if value <= low:
                return
            ratio = min(1.0, (value - low) / (high - low))
            p = ratio * max_penalty
            score -= p
            severity = "high" if ratio > 0.7 else "medium" if ratio > 0.35 else "low"
            explanations.append(Explanation(
                reason=f"{name} is elevated ({value} {unit})",
                impact=f"-{round(p)} WQI points",
                severity=severity,
            ))

        if f["ndwi"] < 0.15:
            score -= 18
            explanations.append(Explanation(reason="Weak NDWI water signal", impact="Possible mixed pixel or shoreline contamination", severity="medium"))

        penalty(f["turbidity_ntu"], 5, 50, 28, "Turbidity", "NTU")
        penalty(f["chlorophyll_a_mg_m3"], 5, 40, 24, "Chlorophyll-a", "mg/m³")
        penalty(f["tsm_mg_l"], 10, 80, 16, "Total suspended matter", "mg/L")
        penalty(abs(f["temperature_anomaly_c"]), 2, 8, 10, "Temperature anomaly", "°C")
        penalty(f["no2_mol_m2"], 0.00008, 0.00025, 8, "NO₂ air pollution proxy", "mol/m²")
        penalty(f["so2_mol_m2"], 0.00001, 0.00008, 6, "SO₂ air pollution proxy", "mol/m²")
        penalty(f["cloud_probability"], 0.55, 1.0, 6, "Cloud uncertainty", "probability")

        score = int(max(0, min(100, round(score))))
        return score, explanations

    @staticmethod
    def classify(score: int) -> tuple[str, str, str, str]:
        if score >= 75:
            return "SAFE", "GOOD", "#22c55e", "Safe to drink if collected cleanly; still prefer filtration in wilderness."
        if score >= 50:
            return "CAUTION", "FAIR", "#eab308", "Treat before drinking: filter and boil or disinfect."
        return "UNSAFE", "POOR", "#ef4444", "Avoid drinking here. Find another source or use emergency purification."
