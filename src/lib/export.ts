export const exportJSON = (data: any, filename = "expenses.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportCSV = (data: any[], filename = "expenses.csv") => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Get all unique keys from all objects (for nested safety)
  const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const value = row[field];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value); // stringify nested objects
          }
          return JSON.stringify(value ?? ""); // wrap in quotes safely
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportQuickBooksFormat = (
  data: any[],
  filename = "quickbooks.csv"
) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Example: Map to QuickBooks-like schema
  const mapped = data.map((item) => ({
    Date: item.date || "",
    Type: item.type || "",
    Amount: item.amount || "",
    Notes: item.notes || "",
  }));

  exportCSV(mapped, filename);
};
