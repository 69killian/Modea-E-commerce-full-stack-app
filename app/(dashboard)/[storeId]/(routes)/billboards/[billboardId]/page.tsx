import prismadb from "@/prisma/prismadb";
import { BillboardForm } from "./components/billboard-form";

interface PageProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    billboard: any;
}

const BillboardsPage = ({ billboard }: PageProps) => {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
    const { billboardId } = context.params;

    // Récupérer les données avec prisma
    const billboard = await prismadb.billboard.findUnique({
        where: { id: billboardId },
    });

    return {
        props: {
            billboard,
        },
    };
}

export default BillboardsPage;
