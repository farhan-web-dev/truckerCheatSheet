import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/Button";
import { useLoginUserVeiw } from "@/hooks/useUser"; // <-- import login user hook

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
  const { data: loginUser } = useLoginUserVeiw(); // logged-in user info
  console.log("loginUser in AssetModal:", loginUser?.companyDOTNumber);
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    model: "",
    year: new Date().getFullYear(),
    engineType: "",
    engineSerialNumber: "",
    assignedDriver: "",
    type: "truck",
    companyDOTNumber: 0, // <-- start with 0, will update after loginUser loads
  });

  useEffect(() => {
    if (initialData) {
      // Edit mode
      setFormData(initialData);
    } else if (loginUser) {
      // Create mode & loginUser loaded
      setFormData((prev) => ({
        ...prev,
        companyDOTNumber:
          loginUser.companyDOTNumber || loginUser.usDotNumber || 0,
      }));
    }
  }, [initialData, loginUser, isOpen]);

  // useEffect(() => {
  //   if (initialData) {
  //     // Edit mode
  //     setFormData(initialData);
  //   } else {
  //     // Create mode
  //     setFormData((prev) => ({
  //       ...prev,
  //       companyDOTNumber: loginUser?.usDotNumber || 0, // fill DOT number from login user
  //     }));
  //   }
  // }, [initialData, isOpen, loginUser]);

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
              disabled={!!initialData} // disable in edit mode
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
