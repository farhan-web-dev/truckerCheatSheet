import { format, differenceInDays, isPast } from "date-fns";
import { FileText } from "lucide-react";

type DocumentType = {
  name: string;
  category: string;
  expiresAt: string;
  url: string;
};

export default function DocumentsList({
  documents,
}: {
  documents: DocumentType[];
}) {
  const getStatus = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);

    if (isPast(expiryDate)) return { label: "expired", color: "bg-red-600" };
    if (daysLeft <= 30)
      return { label: "expiring soon", color: "bg-yellow-700" };
    return { label: "current", color: "bg-green-700" };
  };

  return (
    <div className="text-sm text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Asset Documents</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
          Upload Document
        </button>
      </div>

      {documents?.length === 0 ? (
        <p className="text-gray-400">No documents uploaded.</p>
      ) : (
        <ul className="space-y-3">
          {documents?.map((doc, i) => {
            const status = getStatus(doc.expiresAt);

            return (
              <li
                key={i}
                className="p-4 bg-gray-700 hover:bg-gray-600 transition rounded-xl flex items-start justify-between"
              >
                {/* Left: Icon + Name/Category */}
                <div className="flex gap-3 items-start">
                  <FileText className="text-blue-300 w-6 h-6 mt-1" />
                  <div>
                    <p className="font-medium text-white">{doc.name}</p>
                    <p className="text-gray-400">{doc.category}</p>
                  </div>
                </div>

                {/* Right: Status + Expiry */}
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-md text-white capitalize ${status.color}`}
                  >
                    {status.label}
                  </span>
                  <p className="text-xs mt-1 text-gray-400">
                    Expires: {format(new Date(doc.expiresAt), "yyyy-MM-dd")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
