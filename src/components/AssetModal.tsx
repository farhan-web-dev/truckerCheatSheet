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
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => void;
  initialData?: AssetFormData;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = React.useState<AssetFormData>({
    name: "",
    model: "",
    year: 2024,
    engineType: "",
    engineSerialNumber: "",
    assignedDriver: "",
    type: "truck",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? +value : value,
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
          <Dialog.Title className="text-lg font-semibold">
            {initialData ? "Edit Asset" : "Add Asset"}
          </Dialog.Title>

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="year"
            placeholder="Year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="engineType"
            placeholder="Engine Type"
            value={formData.engineType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="engineSerialNumber"
            placeholder="Engine Serial #"
            value={formData.engineSerialNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="assignedDriver"
            placeholder="Assigned Driver ID"
            value={formData.assignedDriver}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="truck">Truck</option>
            <option value="trailer">Trailer</option>
          </select>

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
