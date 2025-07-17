import { useState, useRef } from "react";
import { useUploadDocument } from "@/hooks/useDocument";
import { FileIcon } from "lucide-react";
import { useUserVeiw } from "@/hooks/useUser";
import { useTruckVeiw } from "@/hooks/useTruck";
import toast from "react-hot-toast";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadDoc, isPending } = useUploadDocument();
  const { data: users } = useUserVeiw();
  const { data: vehicles } = useTruckVeiw();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setCategory(nameWithoutExt);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, "");
      setCategory(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedDriver || !selectedVehicle) {
      toast.error("⚠️ Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("expiryDate", expiryDate);
    formData.append("driver", selectedDriver);
    formData.append("vehicle", selectedVehicle);

    try {
      await uploadDoc(formData);
      toast.success("📄 Document uploaded successfully!");

      // Reset form
      setFile(null);
      setCategory("");
      setExpiryDate("");
      setSelectedDriver("");
      setSelectedVehicle("");
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
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-700">Selected file: {file.name}</p>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded border"
            placeholder="Enter category"
          />

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-4 py-2 rounded border"
            placeholder="Expiry date"
          />

          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          >
            <option value="">Select Driver</option>
            {users?.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          >
            <option value="">Select Vehicle</option>
            {vehicles?.map((vehicle: any) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.name || `${vehicle.type} - ${vehicle.model}`}
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
