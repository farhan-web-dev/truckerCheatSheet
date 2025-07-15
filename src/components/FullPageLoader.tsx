"use client";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1423]/80 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-[#3A4358] border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
