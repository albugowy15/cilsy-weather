"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface UseAppMutation<TData> {
  method?: "POST" | "PUT" | "DELETE";
  body: TData;
  path: string;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useAppMutation = (args: UseAppMutation<any>) => {
  const mutation = useMutation({
    mutationFn: async (): Promise<APIResponse<any>> => {
      const response = await fetch(`http://localhost:5001/${args.path}`, {
        method: args.method || "POST",
        body: JSON.stringify(args.body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: APIResponse<any> = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Sign in successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
