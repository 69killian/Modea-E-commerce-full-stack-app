"use client";
import { Store } from "@prisma/client";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"; // Remplacer Check par CheckCircle
import { Popover } from "@radix-ui/react-popover";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const StoreModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const [open, setOpen] = useState(false);

  const onStoreSelect = (Store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${Store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Selectionnez une boutique"
          className={cn(
            "relative z-10 py-3 px-6 text-center transition-colors duration-300 dark:bg-[#1e1e1e] dark:hover:bg-[#2e2e2e] p-1 shadow-md dark:shadow-[#101010] border-t-2 border-gray-300/10",
            className
          )}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label || "Select a Store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-[17px] shadow-md dark:shadow-[#101010] bg-[#1e1e1e] border-t-2 dark:border-gray-300/10">
        <Command>
          <CommandList className="dark:bg-[#252525]">
            <CommandInput placeholder="Trouver une Boutique..." />
            <CommandEmpty>Aucune Boutique Trouvée...</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  StoreModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
