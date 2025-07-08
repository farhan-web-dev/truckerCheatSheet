"use client";

import dynamic from "next/dynamic";

// Dynamically import the DriverMap (Leaflet needs window)
const DriverMap = dynamic(() => import("./DriverMap"), {
  ssr: false,
});

export default function DriverMapWrapper() {
  return <DriverMap />;
}
