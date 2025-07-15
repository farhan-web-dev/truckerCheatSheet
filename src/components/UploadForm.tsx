import { useState, useRef } from "react";
import { useUploadDocument } from "@/hooks/useDocument";
import { FileIcon } from "lucide-react"; // You can customize icon

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadDoc, isPending } = useUploadDocument();

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
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    await uploadDoc(formData);
    setFile(null);
    setCategory("");
  };

  return (
    <div className="bg-[white] p-6 rounded-xl text-black shadow-md">
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
          onClick={() => fileInputRef.current?.click()}
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
        <div className="mt-6">
          <p className="text-sm text-gray-300">Selected file: {file.name}</p>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full px-4 py-2 rounded bg-white text-black"
            placeholder="Enter category"
          />
          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
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
