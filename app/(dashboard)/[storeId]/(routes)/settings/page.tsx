import prismadb from "@/prisma/prismadb";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: Promise<{ storeId: string }>;
}

const Settingspage: React.FC<SettingsPageProps> = async ({ params }) => {
    // Attente de la résolution de la promesse pour récupérer les paramètres
    const { storeId } = await params;
    
    // Vérification de l'authentification
    const authData = await auth();
    const { userId } = authData;

    if (!userId) {
        redirect("/sign-in");
    }

    // Recherche de la boutique dans la base de données
    const store = await prismadb.store.findFirst({
        where: {
            id: storeId, // Utilisation de storeId directement après avoir résolu la promesse
            userId
        }
    })

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default Settingspage;
