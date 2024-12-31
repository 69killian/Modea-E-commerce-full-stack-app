"use client";

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// installed automatically on package.json after Import
import { zodResolver } from '@hookform/resolvers/zod';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";



const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
const storeModal = useStoreModal();

const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues: {
        name: "",
    },
});

const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // TODO: Create Store 
}

return (
        <Modal
    title="Créer un magasin"
    description="Créez un nouveau magasin pour gérer vos produits et catégories."
    isOpen={storeModal.isOpen}
    onClose={storeModal.onCose}>
        <div>
            <div className='space-y-4 py-2 pb-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='E-commerce Name' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                            <Button type='submit'>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>    
);
    
};