import prismadb from "@/prisma/prismadb";
import { BillboardForm } from "./components/billboard-form";

// Définir explicitement les types des props
const BillboardsPage = async ({
    params,
}: {
    params: { storeId: string; billboardId: string };
}) => {
    const { billboardId } = params;

    // Récupérer les données de la base de données
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
