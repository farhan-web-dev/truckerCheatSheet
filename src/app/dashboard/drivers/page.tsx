// components/UserTable.tsx
"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { useUserVeiw } from "@/hooks/useUser";
import { Plus, QrCode, Search, Filter, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddDriver } from "@/hooks/useAddDriver";

const gpsText = {
  true: { label: "Enabled", style: "text-green-600" },
  false: { label: "Disabled", style: "text-gray-400" },
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  gpsTracking: z.enum(["enable", "disable"]),
  role: z.enum(["driver", "admin"]),
  assignedTruck: z.string().min(1, "Assigned truck is required"),
  password: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const UserTable: React.FC = () => {
  const { data, isLoading, error, refetch } = useUserVeiw();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useAddDriver();

  const onSubmit = (formData: FormData) => {
    mutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
        refetch();
      },
    });
  };

  const filteredData = data?.filter((user: any) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Driver
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700">
          <QrCode size={16} />
          Connect Driver
        </button>

        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#334155] text-white pl-10 pr-4 py-2 rounded-md focus:outline-none"
          />
          <Search size={16} className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        <button className="ml-auto text-gray-400 hover:text-white">
          <Filter size={20} />
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-auto text-left text-white bg-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 uppercase text-sm text-gray-400">
          <tr>
            <th className="p-3">Driver</th>
            <th className="p-3">Assigned Truck</th>
            <th className="p-3">Status</th>
            <th className="p-3">GPS Tracking</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Last Active</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((user: any, index: number) => {
            const gpsEnabled = user.gpsTracking === "enable";
            const initials = user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase();
            const lastActive = new Date(user.createdAt).toLocaleString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                day: "numeric",
                month: "short",
              }
            );

            return (
              <tr
                key={user.id || index}
                className={`${index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}`}
              >
                <td className="p-3 flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                    {initials}
                  </div>
                  <span>{user.name}</span>
                </td>
                <td className="p-3 text-gray-300">
                  {user.assignedTruck?.name || "Unassigned"}
                </td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <Switch checked={gpsEnabled} disabled />
                  <span
                    className={
                      gpsText[String(gpsEnabled) as "true" | "false"].style
                    }
                  >
                    {gpsText[String(gpsEnabled) as "true" | "false"].label}
                  </span>
                </td>
                <td className="p-3 text-gray-300">{user.email}</td>
                <td className="p-3 text-gray-300">{lastActive}</td>
                <td className="p-3 flex gap-4 text-sm">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button className="text-green-500 hover:underline">
                    Message
                  </button>
                  <button className="text-purple-500 hover:underline">
                    📷
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Driver Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Add New Driver
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  {...register("email")}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">Password</label>
                <input
                  {...register("password")}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

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
                <input
                  {...register("assignedTruck")}
                  placeholder="Truck ID or name"
                  className="w-full px-3 py-2 border rounded text-black"
                />
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
                disabled={mutation.status === "pending"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                {mutation.status === "pending"
                  ? "Creating..."
                  : "Create Driver"}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserTable;
