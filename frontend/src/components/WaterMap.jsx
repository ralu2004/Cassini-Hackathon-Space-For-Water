import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function WaterMap({ coords, quality }) {
  const lat = coords?.lat || 46.7712;
  const lon = coords?.lon || 23.6236;
  const wqi = quality?.wqi || 0;

  const color =
    wqi >= 75 ? "#4ade80" :
    wqi >= 50 ? "#fde047" :
    "#f87171";

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={[lat, lon]}
        radius={18}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
      >
        <Popup>
          <strong>{quality?.nearest_water_body?.name || "Water source"}</strong>
          <br />
          WQI: {wqi}/100
          <br />
          {quality?.drinkability}
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
