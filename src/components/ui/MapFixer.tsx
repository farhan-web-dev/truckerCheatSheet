"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapFixer = () => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size after layout settles
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // You can tweak this delay if needed
  }, [map]);

  return null;
};

export default MapFixer;
