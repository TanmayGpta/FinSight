// src/components/GoogleMapView.jsx
import React, { useEffect, useState, useRef } from "react";
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  Polyline, 
  InfoWindow 
} from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function GoogleMapView({ routeData, defaultCenter }) {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  // prefer polyline returned from backend (road polyline). Fallback to direct node coords
  const polylinePositions = routeData?.polyline && routeData.polyline.length > 0
    ? routeData.polyline.map(p => ({ lat: p[0], lng: p[1] }))
    : (routeData?.optimized_route || []).map(p => ({ lat: p.lat, lng: p.lon }));

  const markers = (routeData?.optimized_route || []).map((p, i) => ({
    id: p.id ?? i,
    position: { lat: p.lat, lng: p.lon },
    name: p.name || `Stop ${i + 1}`,
    step: p.step ?? (i + 1),
    type: p.type || "client",
  }));

  // Fit bounds whenever route changes
  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.position));
    mapRef.current.fitBounds(bounds, 50);
  }, [routeData]); // eslint-disable-line

  if (!apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-red-600">
        Missing Google Maps API key (VITE_GOOGLE_API_KEY)
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter ? { lat: defaultCenter[0], lng: defaultCenter[1] } : (markers[0]?.position || { lat: 23.1815, lng: 85.3055 })}
        zoom={13}
        onLoad={map => (mapRef.current = map)}
      >
        {/* Polyline (road path if available) */}
        {polylinePositions && polylinePositions.length > 1 && (
          <Polyline
            path={polylinePositions}
            options={{
              strokeColor: "#059669",
              strokeOpacity: 0.85,
              strokeWeight: 5,
              icons: [{
                icon: { path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 3 },
                offset: "100%"
              }]
            }}
          />
        )}

        {/* Markers */}
        {markers.map((m, idx) => (
          <Marker
            key={`${m.id}-${idx}`}
            position={m.position}
            label={{
              text: String(m.step),
              color: "white",
              fontSize: "11px",
              fontWeight: "600"
            }}
            onClick={() => setActiveMarker(m.id)}
            // optionally change icon based on type
            icon={{
              path: m.type === "branch" ? window.google.maps.SymbolPath.CIRCLE : window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: m.type === "branch" ? "#0f172a" : "#059669",
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 5
            }}
          />
        ))}

        {/* InfoWindow */}
        {activeMarker && (
          (() => {
            const m = markers.find(x => x.id === activeMarker);
            if (!m) return null;
            return (
              <InfoWindow
                position={m.position}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Stop #{m.step}</div>
                </div>
              </InfoWindow>
            );
          })()
        )}
      </GoogleMap>
    </LoadScript>
  );
}
