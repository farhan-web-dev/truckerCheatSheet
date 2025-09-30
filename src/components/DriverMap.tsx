"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import { useUserVeiw } from "@/hooks/useUser";
import { MapIcon, RefreshCcw } from "lucide-react";

type Driver = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  city: string;
  status: "Driving" | "Rest Break" | "Loading" | "Off Duty";
  speed: number;
  lastUpdated: string;
  assignedTruck?: { name: string };
};

const statusColorMap = {
  Driving: "green",
  "Rest Break": "orange",
  Loading: "blue",
  "Off Duty": "gray",
};

const statusDotColor = {
  Driving: "bg-green-500",
  "Rest Break": "bg-orange-400",
  Loading: "bg-blue-500",
  "Off Duty": "bg-gray-500",
};

export default function DriverMap() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Driving" | "Stopped"
  >("All");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const { data: users, refetch } = useUserVeiw();

  const loadDrivers = useCallback(() => {
    if (users) {
      const formattedDrivers = users
        .filter((user) => user.location?.lat && user.location?.lng)
        .map((user) => ({
          id: user._id,
          name: user.name,
          location: {
            lat: user.location.lat,
            lng: user.location.lng,
          },
          city: user.city || "Unknown",
          status: user.status || "Off Duty",
          speed: user.speed || 0,
          lastUpdated: new Date().toISOString(),
          assignedTruck: user?.assignedTruck
            ? { name: user.assignedTruck.name }
            : { name: "Unknown Truck" },
        }));

      setDrivers(formattedDrivers);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [users]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleRefresh = async () => {
    await refetch?.();
    loadDrivers();
  };

  const createIcon = (status: keyof typeof statusColorMap) =>
    new Icon({
      iconUrl: `/marker-${statusColorMap[status]}.svg`,
      iconSize: [30, 30],
    });

  const filteredDrivers = drivers.filter((driver) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Driving") return driver.status === "Driving";
    return driver.status !== "Driving";
  });

  const counts = {
    Driving: drivers.filter((d) => d.status === "Driving").length,
    "Rest Break": drivers.filter((d) => d.status === "Rest Break").length,
    Loading: drivers.filter((d) => d.status === "Loading").length,
    "Off Duty": drivers.filter((d) => d.status === "Off Duty").length,
  };

  return (
    <div className="bg-[#0f172a] text-white p-4 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-green-700 to-blue-800 p-6 rounded-lg mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapIcon /> Live GPS Fleet Tracker
          </h2>
          <p className="text-sm text-gray-200 mt-1">
            Real-time location tracking for signed-in drivers
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleRefresh}
            className="flex gap-2 bg-gray-400 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            <RefreshCcw style={{ width: "20px", height: "20px" }} />
            <span>Refresh</span>
          </button>
          <span className="text-sm text-gray-200">
            Last Updated: {lastUpdated || "--"}
          </span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {Object.entries(counts).map(([status, count]) => (
          <div
            key={status}
            className="bg-[#1e293b] p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{status}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${
                statusDotColor[status as keyof typeof statusDotColor]
              }`}
            />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Driver Tracker</h1>
        <div className="flex gap-2 flex-wrap">
          {["All", "Driving", "Stopped"].map((type) => (
            <button
              key={type}
              onClick={() => setStatusFilter(type as typeof statusFilter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                statusFilter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map */}
        <div className="z-0 w-full lg:w-[70%] h-[400px] lg:h-[500px]">
          <MapContainer
            center={[37.7749, -95.7129]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            {filteredDrivers.map((driver) => (
              <Marker
                key={driver.id}
                position={[driver.location.lat, driver.location.lng]}
                icon={createIcon(driver.status)}
                eventHandlers={{
                  click: () => setSelectedDriverId(driver.id),
                }}
              >
                <Popup>
                  <strong>{driver.name}</strong>
                  <br />
                  Status: {driver.status}
                  <br />
                  Speed: {driver.speed} mph
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] bg-[#1e293b] text-white p-4 rounded-lg max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-1">Active Drivers</h2>
          <p className="text-sm text-gray-400 mb-4">
            {filteredDrivers.length} drivers shown
          </p>
          <div className="space-y-3">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className={`bg-[#2f3e54] p-4 rounded-xl shadow flex flex-col relative border-2 ${
                  driver.id === selectedDriverId
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        statusDotColor[driver.status]
                      }`}
                    ></div>
                    <span className="text-white font-bold text-sm">
                      {driver?.assignedTruck?.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">2 min ago</span>
                </div>
                <div className="text-white font-semibold text-base">
                  {driver.name}
                </div>
                <div className="text-sm text-gray-400 mb-2">{driver.city}</div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{driver.status}</span>
                  <span className="text-blue-400 font-medium">
                    {driver.speed} mph
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
