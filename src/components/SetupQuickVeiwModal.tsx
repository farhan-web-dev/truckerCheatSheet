"use client";

import { useEffect, useState } from "react";
import { X, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

const allFeatures = [
  { id: 1, title: "Driver & Fleet Management" },
  { id: 2, title: "Expense Review" },
  { id: 3, title: "Fleet Assets Management" },
  { id: 4, title: "Driver Chat" },
  { id: 5, title: "Live GPS Fleet Tracker" },
  { id: 6, title: "Document Management" },
  { id: 7, title: "Nearby Services Directory" },
  { id: 8, title: "Promo & Referral Control" },
  { id: 9, title: "BOL Generator" },
  { id: 10, title: "Admin Settings" },
];

const SetupQuickViewModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (updated: any[]) => void;
}) => {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("quickView");
    if (stored) setSelected(JSON.parse(stored));
  }, []);

  const handleAdd = (feature: any) => {
    if (selected.length < 5) {
      setSelected([...selected, feature]);
    }
  };

  const handleRemove = (id: number) => {
    setSelected(selected.filter((item) => item.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selected];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSelected(updated);
  };

  const moveDown = (index: number) => {
    if (index === selected.length - 1) return;
    const updated = [...selected];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSelected(updated);
  };

  const handleSave = () => {
    localStorage.setItem("quickView", JSON.stringify(selected));
    onSave(selected);
    onClose();
  };

  const available = allFeatures.filter(
    (f) => !selected.find((s) => s.id === f.id)
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-white bg-blue-600 hover:bg-blue-700 rounded-full p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-1">
          Setup Quick View Dashboard
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Select and organize your top 5 most-used features for quick access
        </p>

        <div className="flex gap-6">
          {/* Selected Features */}
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">
              Your Quick View ({selected.length}/5)
            </h3>
            {selected.map((item, idx) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-md mb-2"
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {item.title}
                  </p>
                  <span className="text-xs text-gray-500">
                    Position #{idx + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveUp(idx)} title="Move Up">
                    <ArrowUp
                      size={16}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  </button>
                  <button onClick={() => moveDown(idx)} title="Move Down">
                    <ArrowDown
                      size={16}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  </button>
                  <button onClick={() => handleRemove(item.id)} title="Remove">
                    <Trash2
                      size={16}
                      className="text-red-500 hover:text-red-700"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Available Features */}
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">
              Available Features ({available.length})
            </h3>
            <div className="max-h-[300px] overflow-y-auto pr-2">
              {available.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAdd(item)}
                  className="w-full text-left bg-[#F9FAFB] hover:bg-blue-50 px-4 py-2 rounded-md border border-gray-100 mb-2 text-gray-700 text-sm"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupQuickViewModal;
