"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferPageClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const referrer = searchParams.get("referrer");

    if (!code || !referrer) return;

    // Try to open app
    const deepLink = `truckersheet://refer?code=${code}&referrer=${referrer}`;
    window.location.href = deepLink;

    // Fallback to Play Store after 2s
    const timer = setTimeout(() => {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.truckersheet.wynn";
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Opening TruckerSheet...</h1>
      <p>If nothing happens, please download the app below:</p>

      <div className="mt-6 flex gap-4">
        <a
          href="https://play.google.com/store/apps/details?id=com.truckersheet.wynn"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        >
          Download for Android
        </a>
        <a
          href="https://apps.apple.com/app/id1234567890"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Download for iOS
        </a>
      </div>
    </div>
  );
}
