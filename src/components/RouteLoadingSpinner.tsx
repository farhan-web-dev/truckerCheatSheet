"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ContentAreaLoader from "./ContentAreaLoader";

export default function RouteLoadingSpinner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // or 700ms for smooth fade

    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <ContentAreaLoader /> : null;
}
