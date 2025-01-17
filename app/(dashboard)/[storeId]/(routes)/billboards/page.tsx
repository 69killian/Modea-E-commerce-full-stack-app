import { format } from 'date-fns';

import prismadb from '@/prisma/prismadb';
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

const BillboardsPage = async (
    props: {
        params: Promise<{ storeId: string }>
    }
) => {
    const params = await props.params;
    // Récupération des billboards depuis la base de données
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Transformation des données pour correspondre au type BillboardColumn
    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;