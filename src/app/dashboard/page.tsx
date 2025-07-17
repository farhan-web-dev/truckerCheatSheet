"use client";
import { Users, Truck, MapPin } from "lucide-react";
import { useSendGpsRequest, useUserVeiw } from "@/hooks/useUser";
import RouteLoadingSpinner from "@/components/RouteLoadingSpinner";
import { useTruckVeiw } from "@/hooks/useTruck";
import { useNotifications } from "@/hooks/useNotification";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useState } from "react";
import ClientOnly from "@/components/ClientOnly";

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
  const { data: trucks } = useTruckVeiw();
  const [sendingToEmail, setSendingToEmail] = useState<string | null>(null);
  const { mutate: sendGpsRequest } = useSendGpsRequest();

  const { data: notifications = [], isLoading: notifLoading } =
    useNotifications();

  if (isLoading) return <RouteLoadingSpinner />;

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

  const handleRequestGps = (email: string) => {
    if (!email) {
      toast.error("Driver email is missing");
      return;
    }

    setSendingToEmail(email); // 👈 Set current user

    sendGpsRequest(email, {
      onSuccess: () => {
        toast.success(`📧 GPS request sent to ${email}`);
        setSendingToEmail(null); // reset after success
      },
      onError: (err: any) => {
        const message = err?.message || "❌ Failed to send GPS request";
        toast.error(message);
        setSendingToEmail(null); // reset after error
      },
    });
  };

  const recentNotifications = (notifications || []).filter((notif: any) => {
    const notifDate = new Date(notif.createdAt).getTime();
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return notifDate >= twentyFourHoursAgo;
  });

  return (
    <ClientOnly>
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
            <h2 className="text-3xl font-bold text-white">{trucks?.length}</h2>
            <p className="text-sm text-gray-400">3 in maintenance</p>
          </div>
          <div className="bg-green-700 p-2 rounded-md">
            <Truck className="text-white" />
          </div>
        </div>

        {/* Bottom Left: Recent Activity */}
        <div className="bg-[#121A2F] rounded-lg p-4">
          <h3 className="text-white text-lg font-semibold mb-4">
            Recent Activity
          </h3>

          {notifLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : recentNotifications.length === 0 ? (
            <p className="text-gray-500">
              No recent activity in the last 24 hours.
            </p>
          ) : (
            recentNotifications.map((activity: any, idx: number) => (
              <div
                key={activity._id || idx}
                className="bg-[#2B3448] rounded-md p-3 mb-3 text-white flex items-start gap-2"
              >
                <span className="w-2 h-2 mt-2 rounded-full bg-blue-400"></span>
                <div>
                  <p>{activity.message}</p>
                  <p className="text-sm text-gray-400">
                    {formatDistanceToNowStrict(parseISO(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Right: Drivers Online */}
        <div className="bg-[#121A2F] rounded-lg p-4">
          <h3 className="text-white text-lg font-semibold">Drivers Online</h3>

          {/* GPS Enabled */}
          <p className="text-green-400 text-sm mt-3 mb-2">
            GPS Tracking Enabled
          </p>
          {enableGpsDrivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-[#1A2D2B] text-green-300 p-3 rounded-md mb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-sm">{driver.email}</p>
              </div>
              <MapPin size={16} />
            </div>
          ))}

          {/* GPS Disabled */}
          <p className="text-red-400 text-sm mt-4 mb-2">
            GPS Tracking Disabled
          </p>
          {disableGpsDrivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-[#3A1D1D] text-red-300 p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-sm">{driver.email}</p>
              </div>
              <button
                onClick={() => handleRequestGps(driver.email)}
                disabled={sendingToEmail === driver.email}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                {sendingToEmail === driver.email ? "Sending..." : "Request GPS"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
};

export default Dashboard;
