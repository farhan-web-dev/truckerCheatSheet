// components/ui/MapFixer.tsx
"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFixer() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // short delay ensures container is painted
  }, [map]);

  return null;
}
