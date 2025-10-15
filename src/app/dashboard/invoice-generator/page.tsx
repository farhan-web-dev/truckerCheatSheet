"use client";

import { useAddCompany, useUserCompany } from "@/hooks/useAddCompany"; // ✅ includes both hooks
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CompanyProfileForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    usdotNumber: "",
    address: "",
    phone: "",
    email: "",
  });

  // ✅ Get company info for logged-in user
  const { data: userCompany, isLoading } = useUserCompany();

  // ✅ Add new company
  const { mutate: addCompany, isPending } = useAddCompany();

  // ✅ Autofill form if company data already exists
  useEffect(() => {
    if (userCompany) {
      setFormData({
        companyName: userCompany.companyName || "",
        usdotNumber: userCompany.usdotNumber || "",
        address: userCompany.address || "",
        phone: userCompany.phone || "",
        email: userCompany.email || "",
      });
    }
  }, [userCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCompany(formData, {
      onSuccess: () => {
        toast.success("Company profile saved successfully!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to save company profile.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center text-white py-10">
        Loading company info...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 text-white p-6 rounded-lg max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <span className="text-blue-400">
          <i className="fas fa-building"></i>
        </span>
        Company Profile Setup
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            placeholder="Your Trucking Company"
            className="w-full p-3 rounded bg-slate-700 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">USDOT Number *</label>
          <input
            type="text"
            name="usdotNumber"
            value={formData.usdotNumber}
            onChange={handleChange}
            required
            placeholder="123456"
            className="w-full p-3 rounded bg-slate-700 text-white focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Main St, City, State 12345"
            className="w-full p-3 rounded bg-slate-700 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(555) 123-4567"
            className="w-full p-3 rounded bg-slate-700 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="info@company.com"
            className="w-full p-3 rounded bg-slate-700 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending}
          className={`${
            isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-3 rounded flex items-center gap-2`}
        >
          <i className="fas fa-save"></i>
          {isPending ? "Saving..." : "Save Company Profile"}
        </button>
      </div>
    </form>
  );
};

export default CompanyProfileForm;
