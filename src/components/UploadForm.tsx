import { useState, useRef } from "react";
import { useUploadDocument } from "@/hooks/useDocument";
import { FileIcon } from "lucide-react";
import { useUserVeiw } from "@/hooks/useUser";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  "Maintenance",
  "Truck Documents",
  "Driver Documents",
  "Compliance",
  "Permits & Licenses",
  "Shipping Docs",
  "Invoices & Receipts",
  "Insurance",
  "Tax & IFTA",
  "Other",
];

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadDoc, isPending } = useUploadDocument();
  const { data: users } = useUserVeiw();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file || !category) {
      toast.error("⚠️ Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("expiryDate", expiryDate);

    // Only append driver if selected
    if (selectedDriver) {
      formData.append("driver", selectedDriver);
    }

    try {
      await uploadDoc(formData);
      toast.success("📄 Document uploaded successfully!");

      // Reset form
      setFile(null);
      setCategory("");
      setExpiryDate("");
      setSelectedDriver("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "❌ Upload failed!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl text-black shadow-md">
      <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-300 cursor-pointer ${
          isDragging ? "border-blue-400 bg-blue-50/10" : "border-gray-500"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileIcon className="mx-auto text-gray-400 mb-4" size={40} />
        <p className="mb-2 text-gray-300">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Supports PDF, DOC, JPG, PNG files up to 10MB
        </p>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="border-2 border-dashed rounded-xl px-4 py-6 sm:px-10 sm:py-10 mt-4">
          <p className="text-sm text-gray-700 mb-2">
            Selected file: {file.name}
          </p>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded border"
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded border"
          />

          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded border"
          >
            <option value="">Select Driver (optional)</option>
            {users?.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            onClick={handleUpload}
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
