"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { protectedFetch } from "./api";

interface ToastMutationOption {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  onSuccess?: () => void;
  success?: string;
  // eslint-disable-next-line no-unused-vars
  onError?: (error: Error) => void;
}

const useToastMutation = <TBody>(path: string, opts?: ToastMutationOption) => {
  const method = opts?.method || "POST";
  const mutation = useMutation({
    mutationFn: async (body?: TBody) =>
      await protectedFetch(path, { method: method, body: body }),
    onSuccess() {
      toast.success(opts?.success || "Success");
      if (opts?.onSuccess) opts.onSuccess();
    },
    onError(error) {
      toast.error(error.message);
      if (opts?.onError) opts.onError(error);
    },
  });

  return mutation;
};

const useApiQuery = <TData>(path: string, opts?: { key: string[] }) => {
  const query = useQuery({
    queryKey: opts?.key || [path],
    queryFn: async () => await protectedFetch<TData>(path),
  });
  return query;
};

export { useToastMutation, useApiQuery };
