"use client";

import * as z from "zod";
import axios from "axios";
// this package is named with "@", so don't be confused with "@/"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormItem,FormField, FormLabel,FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import {ImageUpload} from "@/components/ui/image-upload";

const formSchema = z.object({
   label: z.string().min(1),
   imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifier un Billboard' : "Créer un Billboard";
    const description = initialData ? 'Modifier un Billboard' : "Ajouter un Billboard";
    const toastMessage = initialData ? 'Billboard mis à jour.' : "Billboard créé.";
    const action = initialData ? 'Sauvegarder les changements' : "Créer";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboard}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`${params.storeId}/billboards`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Une Erreur est survenue.")
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            // the page doesn't exist anymore, so we go back to the home page
            router.push("/");
            toast.success("Billboard supprimé.");
        } catch (error) {
            toast.error("Vérifiez que vous avez supprimé toutes les catégories qi utilisent ce Billboard.");
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
        <FormField
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                                <ImageUpload
                                value={field.value ? [field.value] : []}
                                disabled={loading}
                                onChange={(url) => field.onChange(url)}
                                onRemove={() => field.onChange("")}
                                />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            <div className="grid grid-cols-3 gap-8">
            
                <FormField
                control={form.control}
                name="label"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Intitulé</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Intitulé du Billboard" {...field}/>
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
    <Separator/>
    </>
  )
}