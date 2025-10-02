"use client";
import React, { useState } from "react";
import {
  Copy,
  UserPlus,
  Link as LinkIcon,
  Hash,
  MessageSquare,
  Share2,
  Mail,
  Info,
} from "lucide-react";
import { useTruckVeiw } from "@/hooks/useTruck"; // Adjust path as needed

const DriverConnections: React.FC = () => {
  const dotNumber = "2635449";
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");

  const { data: trucks, isLoading, isError } = useTruckVeiw();

  const directLink = selectedTruckId
    ? `https://trucker-cheat-sheet.app/signup?ref=${selectedTruckId}`
    : "";

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDOTInfo = () => {
    alert(
      `Drivers can join your fleet by entering DOT number: ${dotNumber} and selecting a truck during signup.`
    );
  };

  const handleEmail = () => {
    if (!directLink) return;
    window.location.href = `mailto:?subject=Join our Fleet&body=Join our fleet using this link: ${directLink}`;
  };

  const handleSMS = () => {
    if (!directLink) return;
    window.open(
      `sms:?&body=Join our fleet using this link: ${directLink}`,
      "_blank"
    );
  };

  const handleWhatsApp = () => {
    if (!directLink) return;
    window.open(
      `https://wa.me/?text=Join our fleet using this link: ${directLink}`,
      "_blank"
    );
  };

  return (
    <div className="p-6 bg-[#0e1525] min-h-screen text-white space-y-6">
      {/* Header */}
      <div className="bg-[#1c2233] p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="md:text-2xl text-md font-bold flex items-center gap-2">
              🎁 Driver Connections & Referrals
            </h2>
            <p className="md:text-sm text-xs text-gray-400 mt-1">
              Invite drivers to join your fleet via DOT number or direct link
            </p>
          </div>
          <button className="bg-blue-600 md:px-4 ml-2 p-1 md:py-2 rounded-lg flex items-center gap-2 text-white hover:bg-blue-700">
            <UserPlus size={24} />
            Invite Driver
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <button className="bg-blue-600 md:px-6 p-2 md:py-2 rounded-lg text-white font-semibold">
            Driver Referrals
          </button>
          <button className="bg-[#2a3146] md:px-6 p-2 md:py-2 rounded-lg text-white font-semibold">
            Fleet Connections
          </button>
        </div>
      </div>

      {/* Select Truck */}
      <div className="bg-[#1c2233] p-6 rounded-lg">
        <label className="block mb-2 text-sm font-medium text-white">
          Select a Truck
        </label>
        <select
          value={selectedTruckId}
          onChange={(e) => setSelectedTruckId(e.target.value)}
          className="w-full bg-[#1c2233] text-white border border-gray-600 rounded-lg p-2"
        >
          <option value="">-- Please select a truck --</option>
          {trucks?.map((truck: any) => (
            <option key={truck._id} value={truck._id}>
              {truck.name || truck.plateNumber || truck._id}
            </option>
          ))}
        </select>
        {isError && (
          <p className="text-red-500 mt-2 text-sm">Failed to load trucks</p>
        )}
      </div>

      {/* How Drivers Can Join */}
      <div className="bg-[#1c2233] p-6 rounded-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <LinkIcon size={18} /> How Drivers Can Join
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DOT Method */}
          <div className="bg-[#242b3c] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <Hash size={18} /> DOT Number Method
            </div>
            <p className="text-sm text-gray-400">
              Drivers enter your company’s DOT number and selected truck during
              signup.
            </p>
            <div className="bg-[#1c2233] p-3 rounded-lg flex justify-between items-center">
              <span>{dotNumber}</span>
              <Copy
                className="cursor-pointer hover:text-blue-400"
                size={16}
                onClick={() => copyToClipboard(dotNumber)}
              />
            </div>
          </div>

          {/* Direct Link Method */}
          <div className="bg-[#242b3c] p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <LinkIcon size={18} /> Direct Link Method
            </div>
            <p className="text-sm text-gray-400">
              Share a direct link that connects drivers to your fleet and truck.
            </p>
            <div className="bg-[#1c2233] p-3 rounded-lg flex justify-between items-center">
              <span className="truncate">
                {directLink || "Select a truck to generate referral link"}
              </span>
              {directLink && (
                <Copy
                  className="cursor-pointer hover:text-blue-400"
                  size={16}
                  onClick={() => copyToClipboard(directLink)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={handleSMS}
          className="bg-[#1c2233] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#2a3146]"
        >
          <MessageSquare size={20} />
          <span className="mt-2 font-semibold text-sm">Send SMS</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="bg-[#1c2233] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#2a3146]"
        >
          <Share2 size={20} />
          <span className="mt-2 font-semibold text-sm">WhatsApp</span>
        </button>
        <button
          onClick={handleEmail}
          className="bg-[#1c2233] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#2a3146]"
        >
          <Mail size={20} />
          <span className="mt-2 font-semibold text-sm">Email</span>
        </button>
        <button
          onClick={handleDOTInfo}
          className="bg-[#1c2233] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#2a3146]"
        >
          <Info size={20} />
          <span className="mt-2 font-semibold text-sm">DOT Info</span>
        </button>
      </div>
    </div>
  );
};

export default DriverConnections;
