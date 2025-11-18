// src/components/GoogleMapView.jsx
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Polyline, InfoWindow } from "@react-google-maps/api";
const MAP_LIBRARIES = ["marker"];

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

// SVG generator for numbered pin (returns an HTML string)
// color = pin background (hex without #), label = number/text
function makePinSVG(label, color = "D32F2F", size = 42) {
  // circle-style pin with number centered; tune sizes if needed
  const diameter = size;
  const radius = diameter / 2;
  const fontSize = Math.round(diameter * 0.45);
  // return inline SVG string
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${diameter}" height="${diameter + 6}" viewBox="0 0 ${diameter} ${diameter + 6}">
      <defs>
        <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#s)">
        <!-- pin circle -->
        <path d="M ${radius} 0
                 C ${radius * 1.55} 0 ${diameter} ${radius * 0.45} ${diameter} ${radius}
                 C ${diameter} ${radius * 1.8} ${radius} ${diameter + 6} ${radius} ${diameter + 6}
                 C ${radius} ${diameter + 6} 0 ${radius * 1.8} 0 ${radius}
                 C 0 ${radius * 0.45} ${radius * 0.45} 0 ${radius} 0 Z"
              fill="#${color}" />
        <!-- inner white circle to create small border effect -->
        <circle cx="${radius}" cy="${radius * 0.9}" r="${radius * 0.52}" fill="#${color}" opacity="0.98"/>
        <!-- number -->
        <text x="50%" y="${radius * 0.98}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${label}</text>
      </g>
    </svg>
  `;
}

export default function GoogleMapView({ routeData, defaultCenter }) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapRef = useRef(null);
  const markersRef = useRef([]); // store created AdvancedMarkerElement instances
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const infoWindowRef = useRef(null);

  // Build stops array
  const stops = (routeData?.optimized_route || []).map((s, i) => ({
    id: s.id ?? `stop-${i}`,
    name: s.name ?? `Stop ${i + 1}`,
    step: s.step ?? (i + 1),
    lat: s.lat,
    lon: s.lon,
    raw: s,
  }));

  // polyline positions (prefer server-provided road polyline)
  const polylinePositions =
    routeData?.polyline && routeData.polyline.length > 0
      ? routeData.polyline.map((p) => ({ lat: p[0], lng: p[1] }))
      : stops.map((s) => ({ lat: s.lat, lng: s.lon }));

  // Fit bounds on route change
  useEffect(() => {
    if (!mapRef.current) return;
    if (!stops.length && !defaultCenter) return;

    const bounds = new window.google.maps.LatLngBounds();
    if (stops.length) {
      stops.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lon }));
    } else if (defaultCenter) {
      bounds.extend({ lat: defaultCenter[0], lng: defaultCenter[1] });
    }
    mapRef.current.fitBounds(bounds, 80);
  }, [routeData]); // eslint-disable-line

  // Create AdvancedMarkerElements (and cleanup previous ones) whenever stops change
  useEffect(() => {
    // Clean up previous markers
    if (markersRef.current.length) {
      markersRef.current.forEach((mk) => {
        try {
          mk.setMap(null);
        } catch (e) { /* noop */ }
      });
      markersRef.current = [];
    }

    if (!mapRef.current || !stops.length) return;

    // Create markers using AdvancedMarkerElement from google.maps.marker
    // Ensure the marker library is loaded (we used libraries={['marker']} in LoadScript)
    const MarkerClass = window.google?.maps?.marker?.AdvancedMarkerElement;
    if (!MarkerClass) {
      console.warn("AdvancedMarkerElement not available; ensure 'marker' library is loaded.");
      return;
    }

    stops.forEach((s, idx) => {
      // create a container for the marker content
      const contentDiv = document.createElement("div");
      // set innerHTML to our inline SVG (no external requests)
      contentDiv.innerHTML = makePinSVG(String(idx + 1), "D32F2F", 44);

      // Optional: you can style contentDiv if needed:
      contentDiv.style.transform = "translate(-50%, -100%)"; // position above coordinate

      const advMarker = new MarkerClass({
        map: mapRef.current,
        position: { lat: s.lat, lng: s.lon },
        content: contentDiv,
      });

      // store reference
      markersRef.current.push(advMarker);

      // Add click listener to open InfoWindow (we reuse one InfoWindow)
      advMarker.addListener("click", () => {
        setActiveMarkerId(s.id);
        // InfoWindow handled by React below
      });
    });

    // cleanup on unmount / stops change
    return () => {
      markersRef.current.forEach((mk) => {
        try {
          mk.setMap(null);
        } catch (e) {}
      });
      markersRef.current = [];
    };
  }, [stops]); // eslint-disable-line

  // Render InfoWindow via GoogleMap component (we will use built-in InfoWindow)
  const activeStop = activeMarkerId ? stops.find((s) => s.id === activeMarkerId) : null;

  if (!apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-red-600">
        Missing Google Maps API key (VITE_GOOGLE_MAPS_API_KEY)
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}  libraries={MAP_LIBRARIES}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={defaultCenter ? { lat: defaultCenter[0], lng: defaultCenter[1] } : (stops[0] ? { lat: stops[0].lat, lng: stops[0].lon } : { lat: 23.1815, lng: 85.3055 })}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID
        }}
      >
        {/* Polyline */}
        {polylinePositions && polylinePositions.length > 1 && (
          <Polyline
            path={polylinePositions}
            options={{
              strokeColor: "#059669",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        )}

        {/* InfoWindow rendered by react wrapper */}
        {activeStop && (
          <InfoWindow
            position={{ lat: activeStop.lat, lng: activeStop.lon }}
            onCloseClick={() => setActiveMarkerId(null)}
          >
            <div style={{ minWidth: 160 }}>
              <div style={{ fontWeight: 700 }}>{activeStop.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Stop #{activeStop.step}</div>
              {activeStop.raw?.distance_from_last != null && (
                <div style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
                  {activeStop.raw.distance_from_last === 0 ? "Starting point" : `${activeStop.raw.distance_from_last} km from previous`}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
