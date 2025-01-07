"use client";

import * as z from "zod";
import axios from "axios";
// this package is named with "@", so don't be confused with "@/"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Category } from "@prisma/client";
import { Billboard } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormItem,FormField, FormLabel,FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
   name: z.string().min(1),
   billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifier une catégorie' : "Créer une catégorie";
    const description = initialData ? 'Modifier une catégorie' : "Ajouter une catégorie";
    const toastMessage = initialData ? 'Catégorie mise à jour.' : "Catégorie créée.";
    const action = initialData ? 'Sauvegarder les changements' : "Créer";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Une Erreur est survenue.")
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            // the page doesn't exist anymore, so we go back to the home page
            router.push(`/${params.storeId}/categories`);
            toast.success("Catégorie supprimée.");
        } catch (error) {
            toast.error("Vérifiez que vous avez supprimé toutes les produits qui utilisent ce Billboard.");
            console.log(error);
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
                            <Input disabled={loading} placeholder="Nom de la catégorie" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="billboardId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Billboard</FormLabel>
                            <Select 
                                disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                            defaultValue={field.value} 
                                            placeholder="Selectionnez un billboard"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboard) => (
                                        <SelectItem
                                            key={billboard.id}
                                            value={billboard.id}
                                        >
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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