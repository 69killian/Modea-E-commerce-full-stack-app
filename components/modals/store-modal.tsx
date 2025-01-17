"use client";
import { useState } from 'react';
import axios from 'axios';


import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// installed automatically on package.json after Import
import { zodResolver } from '@hookform/resolvers/zod';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { toast } from 'react-hot-toast';



const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
const storeModal = useStoreModal();

const [loading, setLoading] = useState(false);

const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues: {
        name: "",
    },
});

const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setLoading(true);

        const response = await axios.post("/api/stores", values);

        // go the response and refresh the page
        window.location.assign(`/${response.data.id}`);
    } catch (error) {
        console.log(error);
        toast.error("Une erreur est survenue.");
    } finally {
        setLoading(false);
    }
}


return (
        <Modal
    title="Nouvelle Boutique"
    description="Créez une boutique pour gérer vos produits et catégories."
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}>
        <div>
            <div className='space-y-4 py-2 pb-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder='Nom du Store' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Annuler</Button>
                            <Button disabled={loading} type='submit'>Continuer</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>    
);
    
};