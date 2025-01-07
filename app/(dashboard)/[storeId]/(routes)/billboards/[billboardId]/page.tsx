import prismadb from "@/prisma/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardsPage = async ({
    params,
}: {
    params: { storeId: string; billboardId: string };
}) => {
    const { billboardId } = params;

    const billboard = await prismadb.billboard.findUnique({
        where: { id: billboardId },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardsPage;
