"use client";

import * as z from "zod";
import axios from "axios";
// this package is named with "@", so don't be confused with "@/"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Size } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormItem,FormField, FormLabel,FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
   name: z.string().min(1),
   value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
    initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifier une Taille' : "Créer une Taille";
    const description = initialData ? 'Modifier une Taille' : "Ajouter un Taille";
    const toastMessage = initialData ? 'Taille mise à jour.' : "Taille créée.";
    const action = initialData ? 'Sauvegarder les changements' : "Créer";

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success(toastMessage);
        } catch (error) {
            console.log(error);
            toast.error("Une Erreur est survenue.")
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            // the page doesn't exist anymore, so we go back to the home page
            router.push(`/${params.storeId}/sizes`);
            toast.success("Taille supprimée.");
        } catch (error) {
            console.log(error);
            toast.error("Vérifiez que vous avez supprimé tous les produits qui utilisent cette taille.");
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
    <div className="flex items-center justify-between">
        <Heading
        title={title}
        description={description}
        />

        {/* Conditionnal rendering of the delete button */}
        {initialData && (
        <Button
        disabled={loading}
        variant="destructive"
        size="icon"
        onClick={() => setOpen(true)}
        >
            <Trash className="h-4 w-4"/>
        </Button>
        )}

    </div>
    <Separator/>
    

    <Form {...form}>  
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        
            <div className="grid grid-cols-3 gap-8">
            
                <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Nom de la Taille" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="value"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Valeur</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Valeur de la Taille" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                
            </div>
            
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
        </form>
    </Form>
    </>
  )
}