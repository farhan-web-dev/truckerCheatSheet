"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUser, useUpdateUserWithId } from "@/hooks/useUser";
import { useAddDriver } from "@/hooks/useAddDriver";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useTruckVeiw } from "@/hooks/useTruck";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Partial<DriverData>;
  onSuccess: () => void;
  trucks: any[];
}

interface DriverFormData {
  name: string;
  email?: string;
  password?: string;
  role: string;
  assignedTruck?: string;
  gpsTracking: "enable" | "disable";
}

interface DriverData extends DriverFormData {
  _id: string;
}

export default function DriverModal({
  isOpen,
  onClose,
  mode,
  initialData = {},
  onSuccess,
  trucks,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "driver",
      assignedTruck: "",
      gpsTracking: "enable",
    },
  });

  // console.log("trucks", trucks);
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData?._id) {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "driver",
        assignedTruck: initialData.assignedTruck || "",
        gpsTracking: initialData.gpsTracking || "enable",
      });
    } else if (mode === "create") {
      reset({
        name: "",
        email: "",
        password: "",
        role: "driver",
        assignedTruck: "",
        gpsTracking: "enable",
      });
    }
  }, [isOpen, mode, initialData?._id]);

  const addMutation = useAddDriver();
  const updateMutation = useUpdateUserWithId();

  const isLoading =
    addMutation.status === "pending" || updateMutation.status === "pending";

  // console.log(mode);
  const onSubmit = (formData: DriverFormData) => {
    // console.log("mode", mode);
    // console.log("onSubmit triggered with data:", formData);

    const mutationOptions = {
      onSuccess: () => {
        toast.success(
          mode === "create" ? "Driver created!" : "Driver updated!"
        );
        reset();
        onClose();
        onSuccess(); // refetch
      },
      onError: (error: any) => {
        // Extract error message safely
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!";
        toast.error(errorMessage);
      },
    };

    // Clean assignedTruck if it's an object
    const assignedTruck =
      typeof formData.assignedTruck === "object"
        ? (formData.assignedTruck as any)._id
        : formData.assignedTruck;

    if (mode === "create") {
      addMutation.mutate({ ...formData, assignedTruck }, mutationOptions);
    } else if (mode === "edit") {
      const { email, password, ...dataWithoutEmail } = formData;

      const cleanedData = {
        ...dataWithoutEmail,
        assignedTruck: formData.assignedTruck,
      };

      // console.log("📦 Final cleaned update payload:", cleanedData);

      updateMutation.mutate(
        {
          id: initialData._id,
          updatedData: cleanedData,
        },
        mutationOptions
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4 shadow-lg">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              {mode === "create" ? "Add New Driver" : "Edit Driver"}
            </Dialog.Title>
            <button onClick={onClose}>
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border rounded text-black"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            {mode === "create" && (
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
            )}
            {/* Password */}
            {mode === "create" && (
              <div>
                <label className="block text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-600">Role</label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 border rounded text-black"
              >
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Assigned Truck */}
            <div>
              <label className="block text-sm text-gray-600">
                Assigned Truck
              </label>
              <select
                {...register("assignedTruck", {
                  required: "Assigned truck is required",
                })}
                className="w-full px-3 py-2 border rounded text-black"
              >
                <option value="">Select a truck</option>
                {trucks.map((truck) => (
                  <option key={truck._id} value={truck._id}>
                    {truck.name}
                  </option>
                ))}
              </select>
              {errors.assignedTruck && (
                <p className="text-red-500 text-xs">
                  {errors.assignedTruck.message}
                </p>
              )}
            </div>

            {/* GPS Tracking */}
            <div>
              <label className="block text-sm text-gray-600">
                GPS Tracking
              </label>
              <select
                {...register("gpsTracking")}
                className="w-full px-3 py-2 border rounded text-black"
              >
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Driver"
                : "Update Driver"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export type { DriverData, DriverFormData };
