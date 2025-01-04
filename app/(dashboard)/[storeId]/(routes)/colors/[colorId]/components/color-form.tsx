"use client";

import * as z from "zod";
import axios from "axios";
// this package is named with "@", so don't be confused with "@/"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Color } from "@prisma/client";
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
   value: z.string().min(4).regex(/^#/, {
        message: "La chaine de caractère doit être un hex valide",
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifier une Couleur' : "Créer une Couleur";
    const description = initialData ? 'Modifier une Couleur' : "Ajouter une Couleur";
    const toastMessage = initialData ? 'Couleur mise à jour.' : "Couleur créée.";
    const action = initialData ? 'Sauvegarder les changements' : "Créer";

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`);
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh();
            // the page doesn't exist anymore, so we go back to the home page
            router.push(`/${params.storeId}/colors`);
            toast.success("Couleur supprimée.");
        } catch (error) {
            toast.error("Vérifiez que vous avez supprimé tous les produits qui utilisent cette couleur.");
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
                            <Input disabled={loading} placeholder="Nom de la Couleur" {...field}/>
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
                            <div className="flex items-center gap-x-4 ">
                                <Input disabled={loading} placeholder="Valeur de la Couleur" {...field}/>
                                <div
                                 className="border p-4 rounded-full"
                                 style={{ backgroundColor: field.value }}
                                />
                            </div>
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