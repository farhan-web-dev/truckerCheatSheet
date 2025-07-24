// components/UserTable.tsx
"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { useDeleteUserWithId, useUserVeiw } from "@/hooks/useUser";
import { Plus, QrCode, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConnectDriverModal from "@/components/ConnectDriverModal";
import DriverModal from "@/components/DriverModal";
import type { DriverData } from "@/components/DriverModal";
import { useTruckVeiw } from "@/hooks/useTruck";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const { data, isLoading, error, refetch } = useUserVeiw();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<null | {
    name: string;
    phone?: string;
  }>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: trucks = [], isLoading: truckLoading } = useTruckVeiw();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editData, setEditData] = useState<Partial<DriverData> | undefined>();
  const { mutate: deleteUser } = useDeleteUserWithId();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id, {
        onSuccess: () => {
          toast.success("user deleted successfully");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete user");
        },
      });
    }
  };

  const handleCreate = () => {
    setEditData(undefined);
    setMode("create");
    setIsOpenModal(true);
  };

  const handleEdit = (driver) => {
    setEditData(driver);
    setMode("edit");
    setIsOpenModal(true);
  };

  const filteredData = data?.filter((user: any) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 bg-[#1e293b] p-4 rounded-lg">
        <div className="flex gap-2 mb-4 sm:mb-0">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Driver
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700"
          >
            <QrCode size={16} />
            Connect Driver
          </button>
        </div>

        <ConnectDriverModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          driver={selectedDriver}
        />

        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#334155] text-white pl-10 pr-4 py-2 rounded-md focus:outline-none"
          />
          <Search size={16} className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        <button className="hidden sm:block ml-auto text-gray-400 hover:text-white">
          <Filter size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="hidden sm:table min-w-full table-auto text-left text-white bg-gray-900 rounded-lg overflow-hidden">
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
                  key={user._id || index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  }`}
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
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        user.status === "On Maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : user.status === "Route Active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Off Duty"
                          ? "bg-gray-100 text-gray-800"
                          : user.status === "Loading"
                          ? "bg-blue-100 text-blue-800"
                          : user.status === "Driving"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {user.status}
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
                  <td className="p-3 text-gray-300">
                    {user.phone ? `+${user.phone}` : "+00000000"}
                  </td>
                  <td className="p-3 text-gray-300">{lastActive}</td>
                  <td className="p-3 flex flex-col sm:flex-row gap-2 text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => router.push("/dashboard/chat")}
                      className="text-green-500 hover:underline"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDriver({
                          name: user.name,
                          phone: user.phone,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-purple-500 hover:underline"
                    >
                      <QrCode size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {filteredData?.map((user: any, index: number) => {
            const initials = user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={user._id || index}
                className="bg-gray-800 p-4 rounded-md shadow-sm"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                  <button className="text-white text-xl">
                    {expanded ? "−" : "+"}
                  </button>
                </div>

                {expanded && (
                  <div className="mt-3 text-sm text-gray-300 space-y-2">
                    <p>
                      <strong>Assigned Truck:</strong>{" "}
                      {user.assignedTruck?.name || "Unassigned"}
                    </p>
                    <p>
                      <strong>Status:</strong> {user.status}
                    </p>
                    <p>
                      <strong>GPS:</strong>{" "}
                      <span
                        className={
                          gpsText[
                            user.gpsTracking === "enable" ? "true" : "false"
                          ].style
                        }
                      >
                        {
                          gpsText[
                            user.gpsTracking === "enable" ? "true" : "false"
                          ].label
                        }
                      </span>
                    </p>
                    <p>
                      <strong>Contact:</strong>{" "}
                      {user.phone ? `+${user.phone}` : "+00000000"}
                    </p>
                    <p>
                      <strong>Last Active:</strong>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-400 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => router.push("/dashboard/chat")}
                        className="text-green-400 underline"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDriver({
                            name: user.name,
                            phone: user.phone,
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-purple-400 underline"
                      >
                        QR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Driver Modal */}
      {isOpenModal && (
        <DriverModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          mode={mode}
          initialData={editData}
          onSuccess={refetch}
          trucks={trucks}
        />
      )}
    </div>
  );
};

export default UserTable;
