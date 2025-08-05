import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/Button";

interface AssetFormData {
  _id?: string;
  name: string;
  model: string;
  year: number;
  engineType: string;
  engineSerialNumber: string;
  assignedDriver: string;
  type: "truck" | "trailer";
  companyDOTNumber: number;
}

interface User {
  _id: string;
  name: string;
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => void;
  initialData?: AssetFormData;
  users: User[];
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users,
}) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    model: "",
    year: new Date().getFullYear(),
    engineType: "",
    engineSerialNumber: "",
    assignedDriver: "",
    type: "truck",
    companyDOTNumber: 12345,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // edit mode
    } else {
      setFormData({
        name: "",
        model: "",
        year: new Date().getFullYear(),
        engineType: "",
        engineSerialNumber: "",
        assignedDriver: "",
        type: "truck",
        companyDOTNumber: 12345,
      }); // create mode
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "companyDOTNumber" ? +value : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold">
            {initialData ? "Edit Asset" : "Add Asset"}
          </Dialog.Title>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter name"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter model"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Year</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter year"
            />
          </div>

          {/* Engine Type */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Engine Type
            </label>
            <input
              name="engineType"
              value={formData.engineType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter engine type"
            />
          </div>

          {/* Engine Serial Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Engine Serial Number
            </label>
            <input
              name="engineSerialNumber"
              value={formData.engineSerialNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter serial number"
            />
          </div>

          {/* Company DOT Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              US DOT Number
            </label>
            <input
              name="companyDOTNumber"
              type="number"
              value={formData.companyDOTNumber}
              onChange={handleChange}
              disabled={!!initialData}
              className={`w-full border p-2 rounded ${
                initialData ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter DOT Number"
            />
          </div>

          {/* Assigned Driver */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Assigned Driver
            </label>
            <select
              name="assignedDriver"
              value={formData.assignedDriver}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Asset Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="truck">Truck</option>
              <option value="trailer">Trailer</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {initialData ? "Update" : "Add"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
