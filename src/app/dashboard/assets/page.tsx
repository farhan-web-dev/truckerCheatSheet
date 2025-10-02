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
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";
import { useUserVeiw } from "@/hooks/useUser";
import toast from "react-hot-toast";

type AssetFormData = {
  _id?: string;
  name: string;
  model: string;
  year: number;
  engineType: string;
  engineSerialNumber: string;
  assignedDriver: string;
  type: "truck" | "trailer";
  companyDOTNumber: number;
};

const typeClasses = {
  Truck: "bg-blue-600 text-white px-3 py-1 text-xs rounded-full",
  Trailer: "bg-green-600 text-white px-3 py-1 text-xs rounded-full",
};

const FleetAssetsManagement = () => {
  const { data, isLoading: isLoadingUsers, error, refetch } = useUserVeiw();
  const { data: trucks = [], isLoading, isError } = useTruckVeiw();
  const [filterType, setFilterType] = useState<"All" | "truck" | "trailer">(
    "All"
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    toast.success(`✏️ Editing truck: ${asset?.name || "Unnamed Truck"}`);
  };

  const createTruck = useCreateTruck();
  const updateTruck = useUpdateTruck();
  const handleSubmitAsset = (formData: AssetFormData) => {
    const handleError = (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "❌ Something went wrong!";
      toast.error(errorMessage);
    };

    if (formData._id) {
      updateTruck.mutate(formData, {
        onSuccess: () => {
          toast.success("🚛 Truck updated successfully!");
        },
        onError: handleError,
      });
    } else {
      createTruck.mutate(formData, {
        onSuccess: () => {
          toast.success("🚚 New truck created successfully!");
        },
        onError: handleError,
      });
    }
  };

  const deleteTruck = useDeleteTruck();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this truck?")) {
      deleteTruck.mutate(id, {
        onSuccess: () => {
          toast.success("🚛 Truck deleted successfully!");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "❌ Failed to delete truck.";
          toast.error(errorMessage);
        },
      });
    }
  };

  const filteredTrucks =
    filterType === "All"
      ? trucks
      : trucks.filter((truck) => truck.type === filterType);

  if (isError)
    return <div className="text-red-500 p-4">Error loading assets</div>;

  if (isLoading) return <RouteLoadingSpinner />;
  return (
    <div className="md:p-4 p-2 space-y-2 md:space-y-6 bg-[#0f172a] text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="md:text-xl  text-md font-semibold">
            Fleet Assets Management
          </h2>
          <p className="md:text-sm text-xs text-gray-400">
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

      {/* Mobile View (only show Unit # heading) */}
      <div className="block md:hidden p-4 font-semibold text-gray-300 border-b border-gray-700">
        <div>Unit #</div>
      </div>
      {/* Table */}
      <div className="bg-[#1e293b] rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-7 p-4 font-semibold text-gray-300 border-b border-gray-700">
          <div>Unit #</div>
          <div>Type</div>
          <div>Make/Model</div>
          <div>Year</div>
          <div>US Dot Number</div>
          <div>Assigned Driver</div>
          <div>Actions</div>
        </div>

        {filteredTrucks.map((truck) => (
          <div
            key={truck._id}
            className="border-b border-gray-700 hover:bg-gray-800 transition p-4"
          >
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="text-lg font-semibold">{truck.name}</div>
              <details className="mt-2 bg-gray-700 p-2 rounded-md text-sm">
                <summary className="cursor-pointer text-gray-300">
                  View Details
                </summary>
                <div className="mt-2 space-y-1 text-gray-200">
                  <div>
                    <strong>Type:</strong>{" "}
                    <span className={typeClasses[truck.type] || ""}>
                      {truck.type}
                    </span>
                  </div>
                  <div>
                    <strong>Model:</strong> {truck.model}
                  </div>
                  <div>
                    <strong>Year:</strong> {truck.year}
                  </div>
                  <div>
                    <strong>Assigned Driver:</strong>
                    <select
                      value={truck?.assignedDriver?._id || ""}
                      onChange={(e) =>
                        updateTruck.mutate({
                          ...truck,
                          assignedDriver: e.target.value || null,
                        })
                      }
                      className="bg-gray-800 border-none text-white text-sm rounded-md px-2 py-1 mt-1 block"
                    >
                      <option value="">Unassigned</option>
                      {data?.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Link href={`/dashboard/assets/${truck._id}`}>
                      <Eye className="text-green-500" />
                    </Link>
                    <Pencil
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEdit(truck)}
                    />
                    <Trash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(truck._id)}
                    />
                  </div>
                </div>
              </details>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-7 items-center">
              <div className="font-semibold text-lg">{truck.name}</div>
              <div>
                <span className={typeClasses[truck.type] || ""}>
                  {truck.type}
                </span>
              </div>
              <div>{truck.model}</div>
              <div>{truck.year}</div>
              <div>{truck.companyDOTNumber}</div>
              <div>
                <select
                  value={truck?.assignedDriver?._id || ""}
                  onChange={(e) =>
                    updateTruck.mutate({
                      ...truck,
                      assignedDriver: e.target.value || null,
                    })
                  }
                  className="bg-gray-700 border-none w-[100px] text-white text-sm rounded-md py-1"
                >
                  <option value="">Unassigned</option>
                  {data?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/assets/${truck._id}`}>
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
        users={data || []}
      />
    </div>
  );
};

export default FleetAssetsManagement;
