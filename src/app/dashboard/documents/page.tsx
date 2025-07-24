"use client";

import UploadForm from "@/components/UploadForm";
import DocumentTable from "@/components/DocumentTable";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <UploadForm />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#0d1117] mb-4">
          Document Library
        </h2>
        <DocumentTable />
      </div>
    </div>
  );
}
