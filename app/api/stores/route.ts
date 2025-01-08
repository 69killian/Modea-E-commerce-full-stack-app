import { NextRequest, NextResponse } from "next/server"; // Importer NextRequest
import { getAuth } from "@clerk/nextjs/server"; // Utiliser getAuth
import prismadb from "@/prisma/prismadb";

export async function POST(req: NextRequest) { // Utiliser NextRequest
    try {
        // Récupérer les détails d'authentification de l'utilisateur avec getAuth()
        const { userId } = getAuth(req); 
        console.log('User ID:', userId); 

        if (!userId) {
            return new NextResponse('Accès non autorisé', { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse('Le nom est requis', { status: 400 });
        }

        // Créer la boutique et l'enregistrer dans la base de données
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        // Vérifier si l'erreur est valide et l'enregistrer en toute sécurité
        if (error instanceof Error) {
            console.log('[STORES_POST]', error.message); 
        } else {
            console.log('[STORES_POST]', 'Unknown error');
        }

        return new NextResponse("Internal error", { status: 500 });
    }
}
