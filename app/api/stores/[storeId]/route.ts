import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: { params: Promise<{ storeId: string }> }) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Le nom est requis', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Le Boutique Id est requis", { status: 400});
        }

        const store =  await prismadb.store.updateMany({
            where: {
                userId,
                id: params.storeId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    props: { params: Promise<{ storeId: string }> }
) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Le Boutique Id est requis", { status: 400});
        }

        // actions
        const store =  await prismadb.store.deleteMany({
            where: {
                userId,
                id: params.storeId
            },
        });

        // response
        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}