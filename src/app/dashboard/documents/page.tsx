"use client";

import UploadForm from "@/components/UploadForm";
import DocumentTable from "@/components/DocumentTable";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      {/* Upload Section */}
      <div className="mb-8">
        <UploadForm />
      </div>

      {/* Document Library Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-[#0d1117] mb-4">
          Document Library
        </h2>
        <DocumentTable />
      </div>
    </div>
  );
}
