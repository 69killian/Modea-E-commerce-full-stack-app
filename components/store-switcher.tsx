"use client";
import { Store } from "@prisma/client";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";  // Remplacer Check par CheckCircle
import { Popover } from "@radix-ui/react-popover";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Command, CommandList, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>


interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
};

export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps) {
    const StoreModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (Store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${Store.value}`)
    };
    
    return( 
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant='outline' 
                    size='sm' 
                    role="combobox" 
                    aria-expanded={open}
                    aria-label="Selectionnez une boutique"
                    className={cn ("w-[200px] justify-between", className)}>
                        <StoreIcon className="mr-2 h-4 w-4"/>
                        {currentStore?.label}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 rounded-[10px] shadow">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder='Trouver une Boutique...'/>
                            <CommandEmpty>Aucune Boutique Trouvée...</CommandEmpty>
                            <CommandGroup heading="Stores">
                                {formattedItems.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        onSelect={() => onStoreSelect(store)}
                                        className='text-sm'
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4"/>
                                        {store.label}
                                        <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentStore?.value === store.value
                                                ? 'opacity-100'
                                                : "opacity-0"
                                        )}/>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator/>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={() => {
                                    setOpen(false);
                                    StoreModal.onOpen();
                                }}>
                                    <PlusCircle className="mr-2 h-5 w-5"/>
                                    Create Store
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
    );
}