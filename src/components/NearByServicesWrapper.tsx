// components/NearbyServicesWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const NearbyServicesDirectory = dynamic(
  () => import("@/components/NearByServicesDirectory"),
  { ssr: false }
);

export default function NearbyServicesWrapper() {
  return <NearbyServicesDirectory />;
}
