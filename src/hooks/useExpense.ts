import { useQuery } from "@tanstack/react-query";
import { fetchExpense, fetchExpenseAnalytics } from "@/lib/api/expense";

export const useExpense = (days: number = 0) => {
  return useQuery({
    queryKey: ["expense", days],
    queryFn: () => fetchExpense(days),
    staleTime: 1000 * 60,
  });
};

export const useExpenseAnalytics = () => {
  return useQuery({
    queryKey: ["expenseAnalytics"],
    queryFn: fetchExpenseAnalytics,
    staleTime: 1000 * 60,
  });
};
