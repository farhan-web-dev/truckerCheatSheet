"use state";

import { useState, useMemo } from "react";
import { useDeleteDocument, useGetDocuments } from "@/hooks/useDocument";
import { FileText } from "lucide-react";
import ShareButton from "./ui/ShareButton";

export default function DocumentTable() {
  const { data: documents = [], isLoading } = useGetDocuments();
  const { mutate: deleteDoc } = useDeleteDocument();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "alphabetical">("newest");

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "alphabetical") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    }

    return filtered;
  }, [documents, searchTerm, sortBy]);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="w-full">
      {/* Sort + Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4 text-gray-600">
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "newest" | "alphabetical")
          }
          className="border border-gray-300 rounded px-3 py-2 bg-white text-sm shadow"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="alphabetical">Sort by: A–Z</option>
        </select>

        <input
          type="text"
          placeholder="Search documents..."
          className="px-3 py-2 border border-gray-300 rounded shadow text-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-600 text-left">
              <tr>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="flex items-center gap-3 py-3 px-4">
                    <FileText className="text-red-500" size={28} />
                    <div>
                      <div className="font-medium items-center text-gray-800">
                        {doc.name}
                      </div>
                      <div className="text-xs text-gray-400 uppercase">PDF</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-700 text-center text-xs px-3 py-1 rounded-full font-medium">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{doc.size}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(doc.uploadedAt).toISOString().split("T")[0]}
                  </td>
                  <td className="flex py-3 px-4 space-x-2 text-sm">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={doc.url}
                      download
                      className="text-green-600 font-medium hover:underline"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => deleteDoc(doc._id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                    <ShareButton
                      document={{ _id: doc._id, name: doc.name, url: doc.url }}
                    />
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="block sm:hidden space-y-4">
          {filteredDocuments.length === 0 ? (
            <p className="text-center text-gray-400">No documents found.</p>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-400 uppercase">PDF</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {doc.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Size:</span> {doc.size}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Uploaded:</span>{" "}
                  {new Date(doc.uploadedAt).toISOString().split("T")[0]}
                </p>
                <div className="flex flex-col gap-3 text-sm mt-2">
                  <div className="flex gap-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={doc.url}
                      download
                      className="text-green-600 font-medium hover:underline"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => deleteDoc(doc._id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <ShareButton
                    document={{ _id: doc._id, name: doc.name, url: doc.url }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
