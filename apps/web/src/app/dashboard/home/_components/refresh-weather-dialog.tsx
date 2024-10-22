"use client";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getQueryClient } from "@/providers/react-query";
import { useMutation } from "@tanstack/react-query";
import { protectedFetch } from "@/lib/api";
import { toast } from "sonner";

const RefreshWeatherDialog = () => {
  const queryClient = getQueryClient();
  const refreshWeatherMutation = useMutation({
    mutationFn: () => protectedFetch("/weathers/refresh", { method: "POST" }),
    onSuccess() {
      toast.success(
        "Refresh weather data scheduled, Please check your email for updates",
      );
      queryClient.invalidateQueries({ queryKey: ["weathers"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Weathers
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You want to refresh all saved weather data?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will refresh and updated all weather data for each saved
            locations. You will receive email when this action complete.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => refreshWeatherMutation.mutate()}>
            Yes, Refresh
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { RefreshWeatherDialog };
