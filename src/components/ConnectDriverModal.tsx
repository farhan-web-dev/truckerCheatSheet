"use client";

import { Dialog } from "@headlessui/react";
import { useGenerateConnectLink, useGenerateQrCode } from "@/hooks/useUser";
import { MessageSquare, Share2, X } from "lucide-react";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  driver?: {
    _id?: string;
    name: string;
    phone?: string;
  };
}

export default function ConnectDriverModal({ isOpen, onClose, driver }: Props) {
  const { data, isLoading } = useGenerateQrCode({
    enabled: isOpen && !!driver?._id, // only run when modal open + driver id exists
  });

  const { data: code, isLoading: isLinkLoading } = useGenerateConnectLink(
    driver?._id
  );

  const qrImage = data?.qrCode || "";
  const connectionUrl = data?.connectionUrl || "";
  const hasPhone = !!driver?.phone;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Connect Driver to Fleet
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <p className="text-sm">Loading QR Code...</p>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                {qrImage ? (
                  <Image
                    src={qrImage}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="border rounded bg-gray-100"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-sm text-gray-500">QR not available</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Connection Code:
                </label>
                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm">
                  {isLinkLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <span className="truncate">
                        {code?.linkCode || "No code available"}
                      </span>
                      {code?.linkCode && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(code.linkCode)
                          }
                          className="text-xs bg-gray-300 px-2 py-0.5 rounded hover:bg-gray-400"
                        >
                          Copy
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {hasPhone && (
                <>
                  <span className="text-md text-gray-700 font-medium mb-1 block">
                    Send to {driver.name}:
                  </span>
                  <div className="flex gap-6 mt-2">
                    <a
                      href={`sms:+${driver.phone}?body=${encodeURIComponent(
                        `Hey ${driver.name}, connect to the fleet using this link: ${connectionUrl}`
                      )}`}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-md text-sm shadow"
                    >
                      <MessageSquare className="w-6 h-6" />
                      Send SMS
                    </a>
                    <a
                      href={`https://wa.me/${
                        driver.phone
                      }?text=${encodeURIComponent(
                        `Hey ${driver.name}, please connect to the fleet using this link: ${connectionUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-md text-sm shadow"
                    >
                      <Share2 className="w-6 h-6" />
                      WhatsApp
                    </a>
                  </div>
                </>
              )}

              <div className="bg-blue-100 p-3 mt-5 rounded text-sm text-blue-900">
                <p>
                  <strong>How it works:</strong>
                </p>
                <ol className="list-decimal ml-4 space-y-1 mt-1">
                  <li>Driver scans QR code or clicks the link</li>
                  <li>They log into their account</li>
                  <li>Their account connects to your fleet</li>
                  <li>You can manage them in this panel</li>
                </ol>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
