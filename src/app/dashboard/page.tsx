"use client";
import { Users, Truck, MapPin } from "lucide-react";
import { useUserVeiw } from "@/hooks/useUser";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gpsTracking: string;
  createdAt: string;
}
const Dashboard = () => {
  const { data, isLoading, error } = useUserVeiw();

  if (isLoading) return <div>isloading...................</div>;

  const drivers =
    (data as User[])?.filter((driver) => driver.role === "driver") || [];

  const enableGpsDrivers = drivers.filter(
    (driver) => driver.gpsTracking === "enable"
  );
  const disableGpsDrivers = drivers.filter(
    (driver) => driver.gpsTracking === "disable"
  );

  const thisWeekDrivers = drivers.filter((driver) => {
    const createDate = new Date(driver.createdAt).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return createDate >= sevenDaysAgo;
  });

  console.log(thisWeekDrivers);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Top Cards */}
      <div className="bg-[#121A2F] rounded-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400">Active Drivers</p>
          <h2 className="text-3xl font-bold text-white">{drivers.length}</h2>
          <p className="text-sm text-gray-400">
            +{thisWeekDrivers.length} this week
          </p>
        </div>
        <div className="bg-blue-700 p-2 rounded-md">
          <Users className="text-white" />
        </div>
      </div>

      <div className="bg-[#121A2F] rounded-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400">Fleet Vehicles</p>
          <h2 className="text-3xl font-bold text-white">18</h2>
          <p className="text-sm text-gray-400">3 in maintenance</p>
        </div>
        <div className="bg-green-700 p-2 rounded-md">
          <Truck className="text-white" />
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="bg-[#121A2F] rounded-lg p-4">
        <h3 className="text-white text-lg font-semibold mb-4">
          Recent Activity
        </h3>

        {[
          {
            message: "Carlos Martinez submitted fuel receipt ($180.50)",
            time: "2 hours ago",
          },
          {
            message: "Truck #A-402 completed oil change",
            time: "4 hours ago",
          },
          {
            message: "New message from Driver Ashley Johnson",
            time: "6 hours ago",
          },
        ].map((activity, idx) => (
          <div
            key={idx}
            className="bg-[#2B3448] rounded-md p-3 mb-3 text-white flex items-start gap-2"
          >
            <span className="w-2 h-2 mt-2 rounded-full bg-blue-400"></span>
            <div>
              <p>{activity.message}</p>
              <p className="text-sm text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#121A2F] rounded-lg p-4">
        <h3 className="text-white text-lg font-semibold">Drivers Online</h3>

        {/* GPS Enabled */}
        <p className="text-green-400 text-sm mt-3 mb-2">GPS Tracking Enabled</p>
        {enableGpsDrivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-[#1A2D2B] text-green-300 p-3 rounded-md mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{driver.name}</p>
              <p className="text-sm">{driver.email}</p>{" "}
              {/* You can replace with location if available */}
            </div>
            <MapPin size={16} />
          </div>
        ))}

        {/* GPS Disabled */}
        <p className="text-red-400 text-sm mt-4 mb-2">GPS Tracking Disabled</p>
        {disableGpsDrivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-[#3A1D1D] text-red-300 p-3 rounded-md flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{driver.name}</p>
            </div>
            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md">
              Request GPS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
