// app/layout.tsx
import "@/styles/globals.css";
import React from "react";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"; // ✅ Import this

export const metadata = {
  title: "Fleet Admin",
  description: "Fleet management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
