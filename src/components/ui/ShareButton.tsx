"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  document: {
    _id: string;
    name: string;
    url: string;
  };
}

export default function ShareButton({ document }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Sharing Document: ${document.name}`);
    const body = encodeURIComponent(
      `Please find the document here:\n${document.url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setOpen(false);
  };

  const handleChatClick = () => {
    // You can route to chat with preselected documentId or open a modal
    router.push(`/dashboard/chat`);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <Send size={16} /> Share
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-sm p-6 rounded-xl shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Share via
            </Dialog.Title>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEmailClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                📩 Email
              </button>
              <button
                onClick={handleChatClick}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                💬 Driver Chat
              </button>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
