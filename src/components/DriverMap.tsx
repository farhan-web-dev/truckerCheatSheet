"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
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

  const loadDrivers = () => {
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
        }));
      setDrivers(formattedDrivers);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    loadDrivers();
  }, [users]);

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
    <div className="bg-[#0f172a] text-white p-4">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-green-700 to-blue-800 p-6 rounded-lg mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapIcon /> Live GPS Fleet Tracker
          </h2>
          <p className="text-sm text-gray-200 mt-1">
            Real-time location tracking for signed-in drivers
          </p>
        </div>
        <div className="flex items-center gap-4">
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

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-[#1e293b] p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Active Drivers</p>
            <p className="text-2xl font-bold">{counts.Driving}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="bg-[#1e293b] p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">On Break</p>
            <p className="text-2xl font-bold">{counts["Rest Break"]}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-orange-400" />
        </div>
        <div className="bg-[#1e293b] p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Loading</p>
            <p className="text-2xl font-bold">{counts.Loading}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </div>
        <div className="bg-[#1e293b] p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Off Duty</p>
            <p className="text-2xl font-bold">{counts["Off Duty"]}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-gray-500" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between mb-4 mt-4">
        <h1 className="text-2xl font-bold">Driver Tracker</h1>
        <div className="flex gap-2">
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

      {/* Map and Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map Section */}
        <div className="w-full lg:w-[70%] max-h-[400px]">
          <MapContainer
            center={[37.7749, -95.7129]}
            zoom={4}
            style={{ height: "400px", width: "100%" }}
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

        {/* Sidebar Section */}
        <div className="w-full lg:w-[30%] bg-[#1e293b] text-white p-4 rounded-lg max-h-[400px] overflow-y-auto">
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
                      {driver.id}
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
