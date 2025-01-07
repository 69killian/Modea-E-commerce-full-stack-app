"use client";
import axios from "axios";
// not from next/router !!!!
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProductColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

import { DropdownMenu, 
         DropdownMenuTrigger, 
         DropdownMenuContent,
         DropdownMenuLabel,
         DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { MoreHorizontal, Edit, Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";




interface CellActionProps {
    data: ProductColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Identifiant du Produit copié dans le presse-papier.")
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${data.id}`)
            router.refresh();
            toast.success("Produit supprimé.");
        } catch (error) {
            console.log(error);
            toast.error("Une erreur est survenue.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
        <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-pointer">
                        <Copy className="mr-2 h-4 w-4"/>
                        Copier Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4"/>
                        Éditer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
                        <Trash className="mr-2 h-4 w-4"/>
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};