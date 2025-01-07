import { format } from 'date-fns';
import prismadb from '@/prisma/prismadb';
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

// Utilisation directe des paramètres dans la signature du composant
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
    // Récupération des billboards depuis la base de données
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId, // Utilisation du storeId dynamique
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
