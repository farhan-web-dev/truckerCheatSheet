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

  // const handleEmailClick = () => {
  //   const subject = encodeURIComponent(`Sharing Document: ${document.name}`);
  //   const body = encodeURIComponent(
  //     `Please find the document here:\n${document.url}`
  //   );
  //   <a
  //     href={`mailto:?subject=${encodeURIComponent(
  //       `Sharing Document: ${document.name}`
  //     )}&body=${encodeURIComponent(
  //       `Please find the document here:\n${document.url}`
  //     )}`}
  //     className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center"
  //     onClick={() => setOpen(false)}
  //   >
  //     📩 Email
  //   </a>;

  //   setOpen(false);
  // };

  // const handleChatClick = () => {
  //   const encodedUrl = encodeURIComponent(document.url);
  //   const encodedName = encodeURIComponent(document.name);
  //   router.push(
  //     `/dashboard/chat?documentUrl=${encodedUrl}&documentName=${encodedName}`
  //   );
  //   setOpen(false);
  // };

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
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
                  `Sharing Document: ${document.name}`
                )}&body=${encodeURIComponent(
                  `Please find the document here:\n${document.url}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center"
                onClick={() => setOpen(false)}
              >
                📩 Email
              </a>

              <button
                onClick={() => {
                  const encodedUrl = encodeURIComponent(document.url);
                  const encodedName = encodeURIComponent(document.name);
                  router.push(
                    `/dashboard/chat?documentUrl=${encodedUrl}&documentName=${encodedName}`
                  );
                  setOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                💬 Driver Chat
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
