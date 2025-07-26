"use client";
import React from "react";
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

const DriverConnections: React.FC = () => {
  const dotNumber = "2635449";
  const directLink = `https://trucker-cheat-sheet.app/signup?ref=${dotNumber}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDOTInfo = () => {
    alert(
      `Drivers can join your fleet by entering DOT number: ${dotNumber} during signup or in their profile settings.`
    );
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=Join our Fleet&body=Join our fleet using this link: ${directLink}`;
  };

  const handleSMS = () => {
    window.open(
      `sms:?&body=Join our fleet using this link: ${directLink}`,
      "_blank"
    );
  };

  const handleWhatsApp = () => {
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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🎁 Driver Connections & Referrals
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Invite drivers to join your fleet via DOT number or direct link
            </p>
          </div>
          <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Invite Driver
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <button className="bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold">
            Driver Referrals
          </button>
          <button className="bg-[#2a3146] px-6 py-2 rounded-lg text-white font-semibold">
            Fleet Connections
          </button>
        </div>
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
              Drivers enter your company’s DOT number during signup or in their
              profile settings.
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
              Share a direct link that automatically connects drivers to your
              fleet.
            </p>
            <div className="bg-[#1c2233] p-3 rounded-lg flex justify-between items-center">
              <span className="truncate">{directLink}</span>
              <Copy
                className="cursor-pointer hover:text-blue-400"
                size={16}
                onClick={() => copyToClipboard(directLink)}
              />
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
