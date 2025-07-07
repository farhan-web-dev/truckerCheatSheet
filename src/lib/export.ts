// utils/export.ts

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
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
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
  // Example: Rename or map fields as per QuickBooks format
  const mapped = data.map((item) => ({
    Date: item.date,
    Type: item.type,
    Amount: item.amount,
    Notes: item.notes,
  }));

  exportCSV(mapped, filename);
};
