"use client";

import { useEffect } from "react";

export default function SignupRedirect() {
  useEffect(() => {
    // Try to open the app using the deep link scheme
    const timer = setTimeout(() => {
      // If app is not installed → fallback after 2s
      window.location.href =
        "https://fleetdashboard.truckercheatsheet.com/download-app";
    }, 2000);

    // Deep link to open signup inside the app
    window.location.href = "mytruckerapp://signup";

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Redirecting to the App...</h1>
      <p>If nothing happens, please download the app below:</p>
      <div className="mt-6 flex gap-4">
        <a
          href="https://play.google.com/store/apps/details?id=com.mytruckerapp"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        >
          Download for Android
        </a>
        <a
          href="https://apps.apple.com/app/id1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Download for iOS
        </a>
      </div>
    </div>
  );
}
