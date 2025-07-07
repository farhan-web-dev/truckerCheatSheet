"use client";
import React, { useState } from "react";
import { useTruckVeiw } from "@/hooks/useTruck";
import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AssetModal } from "@/components/AssetModal";
import { useCreateTruck, useUpdateTruck } from "@/hooks/useTruckMutation";
import { useDeleteTruck } from "@/hooks/useDeleteTruck";

type AssetFormData = {
  _id?: string;
  name: string;
  model: string;
  year: number;
  engineType: string;
  engineSerialNumber: string;
  assignedDriver: string;
  type: "truck" | "trailer";
};

const typeClasses = {
  Truck: "bg-blue-600 text-white px-3 py-1 text-xs rounded-full",
  Trailer: "bg-green-600 text-white px-3 py-1 text-xs rounded-full",
};

const FleetAssetsManagement = () => {
  const { data: trucks = [], isLoading, isError } = useTruckVeiw();
  const [filterType, setFilterType] = useState<"All" | "truck" | "trailer">(
    "All"
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<AssetFormData | undefined>(
    undefined
  );

  const handleOpenAdd = () => {
    setEditAsset(undefined);
    setModalOpen(true);
  };

  const handleEdit = (asset: any) => {
    setEditAsset(asset);
    setModalOpen(true);
  };

  const createTruck = useCreateTruck();
  const updateTruck = useUpdateTruck();

  const handleSubmitAsset = (formData: AssetFormData) => {
    if (formData._id) {
      updateTruck.mutate(formData, {
        onSuccess: () => {
          console.log("Truck updated successfully");
        },
        onError: (error) => {
          console.error("Update failed:", error);
        },
      });
    } else {
      createTruck.mutate(formData, {
        onSuccess: () => {
          console.log("Truck created successfully");
        },
        onError: (error) => {
          console.error("Create failed:", error);
        },
      });
    }
  };

  const deleteTruck = useDeleteTruck();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this truck?")) {
      deleteTruck.mutate(id, {
        onSuccess: () => {
          console.log("Truck deleted");
          // toast.success("Deleted!") or close modal, etc.
        },
        onError: (error) => {
          console.error("Delete failed:", error);
        },
      });
    }
  };

  const filteredTrucks =
    filterType === "All"
      ? trucks
      : trucks.filter((truck) => truck.type === filterType);

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError)
    return <div className="text-red-500 p-4">Error loading assets</div>;

  return (
    <div className="p-4 space-y-6 bg-[#0f172a] text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Fleet Assets Management</h2>
          <p className="text-sm text-gray-400">
            Manage trucks, trailers, and equipment with unit numbers
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Asset
        </Button>
      </div>

      <div className="bg-[#1e293b] p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-3">Filter by type:</h3>
        <div className="flex space-x-2">
          {["All", "truck", "trailer"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as "All" | "truck" | "trailer")}
              className={cn(
                "px-4 py-1 rounded-md text-sm font-medium",
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-100 hover:bg-gray-500"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 p-4 font-semibold text-gray-300 border-b border-gray-700">
          <div>Unit #</div>
          <div>Type</div>
          <div>Make/Model</div>
          <div>Year</div>
          <div>Mileage</div>
          <div>Assigned Driver</div>
          <div>Actions</div>
        </div>

        {filteredTrucks.map((truck) => (
          <div
            key={truck.name}
            className="grid grid-cols-7 items-center p-4 border-b border-gray-700 hover:bg-gray-800 transition"
          >
            <div className="font-semibold text-lg">{truck.name}</div>
            <div>
              <span className={typeClasses[truck.type] || ""}>
                {truck.type}
              </span>
            </div>
            <div>{truck.model}</div>
            <div>{truck.year}</div>
            <div>2343 mi</div>
            <div className="flex items-center gap-2">
              <select
                defaultValue={truck?.assignedDriver?.name}
                className="bg-gray-700 border-none text-white text-sm rounded-md px-3 py-1"
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Carlos Martinez">Carlos Martinez</option>
                <option value="Ashley Johnson">Ashley Johnson</option>
                <option value="Eduardo Hernandez">Eduardo Hernandez</option>
              </select>
              <div className="flex ml-4 gap-2">
                <Link href={`/assets/${truck._id}`}>
                  <Eye className="cursor-pointer text-green-500" />
                </Link>
                <Pencil
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(truck)}
                />
                <Trash
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => handleDelete(truck._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitAsset}
        initialData={editAsset}
      />
    </div>
  );
};

export default FleetAssetsManagement;
