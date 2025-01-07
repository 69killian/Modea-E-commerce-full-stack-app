import { format } from 'date-fns';
import prismadb from '@/prisma/prismadb';
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

// Définition du type pour params comme une promesse
type Params = Promise<{ storeId: string }>;

// Composant avec params comme Promise
const BillboardsPage = async ({ params }: { params: Params }) => {
    // Attente de la résolution de params
    const { storeId } = await params;

    // Récupération des billboards depuis la base de données
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId, // Utilisation de storeId après sa résolution
        },
        orderBy: {
            createdAt: "desc", // Tri par date de création décroissante
        },
    });

    // Transformation des données pour correspondre au type BillboardColumn
    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"), // Formatage de la date
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Passer les données formatées au composant BillboardClient */}
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;
