"use client";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { protectedFetch } from "@/lib/api";
import { getQueryClient } from "@/providers/react-query";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteLocationAlertProps {
  locationId: string;
}

export function DeleteLocationAlert(props: DeleteLocationAlertProps) {
  const queryClient = getQueryClient();
  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      return await protectedFetch(`/locations/${locationId}`, {
        method: "DELETE",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
      toast.success("Location deleted");
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={deleteLocationMutation.isPending}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            location.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteLocationMutation.mutate(props.locationId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
