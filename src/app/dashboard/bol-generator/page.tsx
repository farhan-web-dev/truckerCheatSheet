"use client";
import { useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import BOLPreviewPDF from "@/components/BolPreviewPdf";
import ClientOnly from "@/components/ClientOnly";

export default function BOLForm() {
  const [formData, setFormData] = useState({
    bolNumber: `BOL-${Date.now()}`,
    pickupDate: "",
    shipper: {
      companyName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
    consignee: {
      companyName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
    carrier: {
      name: "Trucker Cheat Sheet Transport",
      driverName: "",
      truckNumber: "",
      trailerNumber: "",
    },
    shipment: {
      deliveryDate: "",
      commodity: "",
      description: "",
      weight: "",
      pieces: "",
      packageType: "Pallets",
      hazmat: false,
      instructions: "",
      charges: {
        freight: "",
        fuel: "",
        other: "",
        total: "<calculated_total>",
      },
    },
  });

  const [showPDF, setShowPDF] = useState(false);

  const [isHazmat, setIsHazmat] = useState(false);

  const handleHazmatToggle = (e) => {
    setIsHazmat(e.target.checked);
    handleChange(e); // propagate the change
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    const path = name.split(".");

    setFormData((prev) => {
      const updated = { ...prev };
      let ref: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = type === "checkbox" ? checked : value;
      return updated;
    });
  };

  const handleDownload = async () => {
    const blob = await pdf(<BOLPreviewPDF data={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bill_of_lading.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Bill of Lading (BOL) Document");
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the Bill of Lading (BOL) document attached.\n\nKindly download it first, then attach it to this email.\n\nThanks.`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      "Hi, here's the Bill of Lading (BOL) document."
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <ClientOnly>
      <div className=" p-6 space-y-6 bg-slate-900 text-white h-full">
        <header className="bg-blue-700 text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">BOL Template Creater</h1>
          <p className="text-lg opacity-90">
            Create professional Bill of Lading documents and export via email or
            WhatsApp
          </p>
        </header>
        {/* BOL Info */}
        <div className="flex">
          <div className="flex flex-col gap-6 w-[75%] h-full">
            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4">
              <h2 className="text-lg font-semibold">BOL Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    BOL Number
                  </label>
                  <input
                    value={formData.bolNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, bolNumber: e.target.value })
                    }
                    className="w-full bg-slate-700 text-white rounded px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full bg-slate-700 text-white rounded px-4 py-2"
                  />
                </div>
              </div>
            </section>

            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4 ">
              <h2 className="text-lg font-semibold">Shipper Information</h2>

              {/* Company Name */}
              <div>
                <label className="block text-sm mb-1">Company Name</label>
                <input
                  type="text"
                  name="shipper.companyName"
                  placeholder="Shipper company name"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="shipper.address"
                  placeholder="Street address"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* City and State */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="shipper.city"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="shipper.state"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* ZIP Code and Phone */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="shipper.zip"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    name="shipper.phone"
                    placeholder="(555) 123-4567"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* Consignee Info */}
            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4 ">
              <h2 className="text-lg font-semibold">Consignee Information</h2>

              {/* Company Name */}
              <div>
                <label className="block text-sm mb-1">Company Name</label>
                <input
                  type="text"
                  name="shipper.companyName"
                  placeholder="Shipper company name"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="shipper.address"
                  placeholder="Street address"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* City and State */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="shipper.city"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="shipper.state"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* ZIP Code and Phone */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="shipper.zip"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    name="shipper.phone"
                    placeholder="(555) 123-4567"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* Carrier Info */}
            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4">
              <h2 className="text-lg font-semibold">Carrier Information</h2>

              {/* Carrier Name (Disabled) */}
              <div>
                <label className="block text-sm mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={formData.carrier.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carrier: {
                        ...formData.carrier,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-700 text-white rounded px-4 py-2"
                />
              </div>

              {/* Driver Name and Truck Number */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Driver Name</label>
                  <input
                    type="text"
                    name="carrier.driverName"
                    placeholder="Driver full name"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Truck Number</label>
                  <input
                    type="text"
                    name="carrier.truckNumber"
                    placeholder="T-001"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Trailer Number */}
              <div>
                <label className="block text-sm mb-1">
                  Trailer Number (Optional)
                </label>
                <input
                  type="text"
                  name="carrier.trailerNumber"
                  placeholder="TR-001"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>
            </section>

            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4 ">
              <h2 className="text-lg font-semibold">Shipment Details</h2>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm mb-1">Delivery Date</label>
                <input
                  type="date"
                  name="shipment.deliveryDate"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2"
                />
              </div>

              {/* Commodity */}
              <div>
                <label className="block text-sm mb-1">Commodity</label>
                <input
                  type="text"
                  name="shipment.commodity"
                  placeholder="Commodity"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1">
                  Description of Goods
                </label>
                <textarea
                  name="shipment.description"
                  placeholder="Description of goods"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* Weight & Pieces */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Weight</label>
                  <input
                    type="text"
                    name="shipment.weight"
                    placeholder="Weight"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Pieces</label>
                  <input
                    type="text"
                    name="shipment.pieces"
                    placeholder="Pieces"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Package Type */}
              <div>
                <label className="block text-sm mb-1">Package Type</label>
                <select
                  name="shipment.packageType"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2"
                >
                  <option value="Pallets">Pallets</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Crates">Crates</option>
                </select>
              </div>

              {/* Hazmat */}
              <div>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="shipment.hazmat"
                    onChange={handleHazmatToggle}
                    className="mr-2"
                  />
                  Hazmat Material
                </label>
              </div>

              {isHazmat && (
                <div>
                  <label className="block text-sm mb-1">
                    Hazmat Description
                  </label>
                  <input
                    type="text"
                    name="shipment.hazmatDescription"
                    placeholder="Describe hazardous materials"
                    onChange={handleChange}
                    className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-sm mb-1">
                  Special Instructions
                </label>
                <textarea
                  name="shipment.instructions"
                  placeholder="Special Instructions"
                  onChange={handleChange}
                  className="w-full bg-slate-700 rounded px-3 py-2 placeholder-slate-400"
                />
              </div>

              {/* Charges */}
            </section>
            <section className="bg-slate-800 p-6 rounded-xl text-white space-y-4 mb-6">
              <div className="pt-4">
                <h3 className="text-md font-semibold mb-2">Charges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["freight", "fuel", "other", "total"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)} Charges
                      </label>
                      <input
                        type="number"
                        name={`shipment.charges.${field}`}
                        onChange={handleChange}
                        className="w-full bg-slate-700 rounded px-3 py-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg text-white space-y-6">
            <div>
              <div className="text-lg font-semibold mb-4">Actions</div>
              <button
                onClick={() => setShowPDF(true)}
                className="w-full bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v10h8V6H6zm2 2a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm3 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Preview BOL
              </button>
            </div>

            <div>
              <div className="text-lg font-semibold mb-4">Export Options</div>
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2"
                  onClick={handleDownload}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download PDF
                </button>

                <button
                  className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2"
                  onClick={handleEmailShare}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email PDF
                </button>

                <button
                  className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2"
                  onClick={handleWhatsAppShare}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.938-1.493l-2.478.784a1 1 0 01-1.21-.868l-.208-2.616A8 8 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM9.5 7.5a.5.5 0 00-1 0v3.5a.5.5 0 00.5.5h2a.5.5 0 000-1H10V7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  WhatsApp Share
                </button>
              </div>
            </div>

            <div>
              <div className="text-lg font-semibold mb-4">BOL Information</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">BOL Number:</span>
                  <span className="font-medium">{`BOL-${Date.now()}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Created:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-medium text-yellow-500">Draft</span>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Preview */}
          {showPDF && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden relative">
                <button
                  onClick={() => setShowPDF(false)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Close
                </button>
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                  <BOLPreviewPDF data={formData} />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
