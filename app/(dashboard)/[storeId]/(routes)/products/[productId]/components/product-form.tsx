"use client";

import * as z from "zod";
import axios from "axios";
// this package is named with "@", so don't be confused with "@/"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormItem,FormField, FormLabel,FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import {ImageUpload} from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
   name: z.string().min(1),
   images: z.object({ url: z.string() }).array(),
   price: z.coerce.number().min(1),
   categoryId: z.string().min(1),
   colorId: z.string().min(1),
   sizeId: z.string().min(1),
   isFeatured: z.boolean().default(false).optional(),
   isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];

}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Modifier un Produit' : "Créer un Produit";
    const description = initialData ? 'Modifier un Produit' : "Ajouter un Produit";
    const toastMessage = initialData ? 'Produit mis à jour.' : "Produit créé.";
    const action = initialData ? 'Sauvegarder les changements' : "Créer";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            // the page doesn't exist anymore, so we go back to the home page
            router.push(`/${params.storeId}/products`);
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
                name="images"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                                <ImageUpload
                                value={field.value.map((image) => image.url)}
                                disabled={loading}
                                onChange={(url) => field.onChange([...field.value, { url }])}
                                onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            <div className="grid grid-cols-3 gap-8">
            
                <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Nom du Produit" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="price"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Prix</FormLabel>
                        <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
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
                                                placeholder="Selectionnez une Catégorie"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            <FormMessage/>
                        </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="sizeId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Taille</FormLabel>
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
                                                placeholder="Selectionnez une Taille"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizes.map((size) => (
                                            <SelectItem
                                                key={size.id}
                                                value={size.id}
                                            >
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            <FormMessage/>
                        </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="colorId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Couleur</FormLabel>
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
                                                placeholder="Selectionnez une Couleur"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map((color) => (
                                            <SelectItem
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            <FormMessage/>
                        </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 ronded-md border p-4">
                           <FormControl>
                           <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    En tête d&apos;affiche
                                </FormLabel>
                                <FormDescription>
                                    Ce produit apparaîtra en page d&apos;accueil.
                                </FormDescription>
                            </div>
                           
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isArchived"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 ronded-md border p-4">
                           <FormControl>
                           <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Archivé
                                </FormLabel>
                                <FormDescription>
                                    Ce produit n&apos;apparaîtra pas en page d&apos;accueil.
                                </FormDescription>
                            </div>
                           
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