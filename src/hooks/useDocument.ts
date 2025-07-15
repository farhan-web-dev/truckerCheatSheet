// hooks/useDocuments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDocuments,
  deleteDocument,
  uploadDocument,
  fetchDocumentsByTruckId,
} from "@/lib/api/document";

export const useGetDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    select: (data) => data.documents,
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useDocumentsByTruckId = (id: string) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocumentsByTruckId(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
