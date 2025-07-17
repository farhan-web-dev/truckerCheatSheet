import React, { useState } from "react";

const AdminPreferences = () => {
  const [dashboardView, setDashboardView] = useState("Overview");
  const [timeZone, setTimeZone] = useState("Eastern Time (ET)");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  const handleSavePreferences = () => {
    const preferences = { dashboardView, timeZone, dateFormat };
    // console.log("Saved Preferences:", preferences);
  };

  return (
    <div className="bg-[#1E293B]  p-4 text-white">
      <div className=" mx-auto">
        <h2 className="text-xl font-semibold mb-6">Dashboard Preferences</h2>

        {/* Default Dashboard View */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm">
            Default Dashboard View
          </label>
          <select
            value={dashboardView}
            onChange={(e) => setDashboardView(e.target.value)}
            className="w-full bg-[#334155] text-white p-3 rounded-md appearance-none focus:outline-none"
          >
            <option>Overview</option>
            <option>Quick View</option>
            <option>Driver Management</option>
          </select>
        </div>

        {/* Time Zone */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm">Time Zone</label>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="w-full bg-[#334155] text-white p-3 rounded-md appearance-none focus:outline-none"
          >
            <option>Eastern Time (ET)</option>
            <option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option>
            <option>Pacific Time (PT)</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm">Date Format</label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full bg-[#334155] text-white p-3 rounded-md appearance-none focus:outline-none"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSavePreferences}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default AdminPreferences;
