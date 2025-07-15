// components/ContentAreaLoader.tsx
"use client";

export default function ContentAreaLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0E1423]/10">
      <div className="w-10 h-10 border-4 border-[#3A4358] border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
