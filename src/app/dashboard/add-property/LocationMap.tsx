"use client";

import { LatLngExpression, Marker as LeafletMarker } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { PropertyFormData } from "./AddPropertyForm"; // Import your form data type

function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function LocationMap() {
  const { watch, setValue, getValues } = useFormContext<PropertyFormData>();

  // Get initial values from the form
  const lat = getValues("latitude");
  const lng = getValues("longitude");
  const position: LatLngExpression = [lat, lng];

  // Watch for changes in the form
  const watchedLat = watch("latitude");
  const watchedLng = watch("longitude");
  const watchedPosition: LatLngExpression = [watchedLat, watchedLng];

  const markerRef = useRef<LeafletMarker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      },
    }),
    [setValue]
  );

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* This component updates the map's view */}
      <ChangeView center={watchedPosition} />

      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={watchedPosition}
        ref={markerRef}
      >
        <Popup>Drag me to the correct location!</Popup>
      </Marker>
    </MapContainer>
  );
}
