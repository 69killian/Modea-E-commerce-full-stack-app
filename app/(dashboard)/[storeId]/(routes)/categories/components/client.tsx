"use client";

import { useRouter, useParams } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";


interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Catégories (${data.length})`}
                description="Gérer les catégories de votre Boutique"
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Ajouter
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="Appels API pour Catégories"/>
            <Separator/>
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    )
}