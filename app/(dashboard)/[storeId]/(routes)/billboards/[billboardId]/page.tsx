
import prismadb from "@/prisma/prismadb";

import { BillboardForm } from "./components/billboard-form";

const BillboardsPage = async (
    props: {
        params: Promise<{ billboardId: string }>
    }
) => {
    const params = await props.params;
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
}

export default BillboardsPage;