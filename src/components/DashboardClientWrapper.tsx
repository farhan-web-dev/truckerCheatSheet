// components/DashboardClientWrapper.tsx
"use client";

import NotificationListener from "@/components/NotificationListener";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NotificationListener />
      <RouteLoadingSpinner />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  );
}
