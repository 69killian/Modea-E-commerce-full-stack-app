import { format } from 'date-fns';

import prismadb from '@/prisma/prismadb';
import { SizesClient } from './components/client';
import { SizeColumn } from './components/columns';

const SizesPage = async (
    props: {
        params: Promise<{ storeId: string }>
    }
) => {
    const params = await props.params;
    // Récupération des billboards depuis la base de données
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Transformation des données pour correspondre au type BillboardColumn
    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient data={formattedSizes} />
            </div>
        </div>
    );
};

export default SizesPage;
