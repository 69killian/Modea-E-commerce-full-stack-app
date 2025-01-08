import prismadb from "@/prisma/prismadb";

import { BillboardForm } from "./components/billboard-form";

    interface BillboardsPageProps {
        params: {
            billboardId: string;
        };
    }

    const BillboardsPage = async ({ params }: BillboardsPageProps) => {
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId,
        },
    });

    
    if (!billboard) {
        return <div>Billboard not found</div>;
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardsPage;
