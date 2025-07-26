"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const MapFixer = () => {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map) return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const container = map.getContainer();
    containerRef.current = container;

    observer.observe(container);

    // initial invalidateSize
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [map]);

  return null;
};

export default MapFixer;
