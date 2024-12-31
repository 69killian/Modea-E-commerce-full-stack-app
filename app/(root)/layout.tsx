import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';

import prismadb from "@/prisma/prismadb";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Recherche si l'utilisateur a un store existant
    const store = await prismadb.store.findFirst({
        where: {
            userId
        },
    });

    // Si un store est trouvé, redirigez vers ce store
    if (store) {
        redirect(`/${store.id}`);
    }

    // Si aucun store n'est trouvé, affichez les enfants de la page (contenu principal)
    return <>{children}</>;
}
