import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // Use getAuth instead of auth
import prismadb from "@/prisma/prismadb";

export async function POST(req: Request) {
    try {
        // Retrieve user authentication details using getAuth()
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

        // Create the store and save it to the database
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        // Check if error is valid and log it safely
        if (error instanceof Error) {
            console.log('[STORES_POST]', error.message); 
        } else {
            console.log('[STORES_POST]', 'Unknown error');
        }

        return new NextResponse("Internal error", { status: 500 });
    }
}
