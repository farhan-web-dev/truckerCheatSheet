// app/layout.tsx
import "@/styles/globals.css";
import React from "react";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Wynn | The Smartest Deisel Mechanic Ever | Trucker Cheat Sheet",
  description: "Trucker Cheat Sheet Admin Panel",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <RouteLoadingSpinner /> */}
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
