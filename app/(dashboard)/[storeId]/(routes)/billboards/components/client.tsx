"use client";

import { useRouter, useParams } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";


interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                title={`Billboards (${data.length})`}
                description="Gérer les Billboards de votre Boutique"
                />
                <Button className="dark:bg-[#2e2e2e] dark:text-white dark:border-gray-500" onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Ajouter
                </Button>
            </div>
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title="API" description="Appels API pour Billboards"/>
            <Separator/>
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}