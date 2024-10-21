"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getQueryClient } from "@/providers/react-query";
import { useApiQuery, useToastMutation } from "@/lib/query";

const addLocationFormSchema = z.object({
  country_code: z
    .string({ required_error: "Please select the country" })
    .min(1, { message: "Please select the country" }),
  city_name: z
    .string({ required_error: "Please input the city" })
    .min(1, { message: "Please input the city" }),
});
type AddLocationFormSchema = z.infer<typeof addLocationFormSchema>;

type CountryQueryResponseData = {
  name: string;
  code: string;
};

const AddLocationDialog = () => {
  const queryClient = getQueryClient();
  const form = useForm<AddLocationFormSchema>({
    resolver: zodResolver(addLocationFormSchema),
    defaultValues: {
      country_code: "",
      city_name: "",
    },
  });
  const countryQuery = useApiQuery<CountryQueryResponseData[]>("/countries", {
    key: ["countries"],
  });
  const addLocationMutation = useToastMutation<AddLocationFormSchema>(
    "/locations",
    {
      success: "Location saved",
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["locations"],
        });
        form.reset();
      },
    },
  );
  const countries = countryQuery.data?.json?.data || [];
  const onSubmit = (data: AddLocationFormSchema) => {
    addLocationMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Location</DialogTitle>
              <DialogDescription>
                Add new location. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-5">
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Country</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? countries.find(
                                  (country) => country.code === field.value,
                                )?.name
                              : "Select country..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map((country) => (
                                <CommandItem
                                  key={country.code}
                                  value={country.name}
                                  onSelect={() => {
                                    form.setValue("country_code", country.code);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === country.code
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {country.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel htmlFor="city_name">City</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={addLocationMutation.isPending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { AddLocationDialog };
