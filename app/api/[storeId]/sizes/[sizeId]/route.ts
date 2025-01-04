import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId) {
            return new NextResponse("L'id de la Taille est requis", { status: 400});
        }

        
        // actions
        const size =  await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            },
        });

        // response
        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est requis", { status: 400 });
        }

        if (!value) {
            return new NextResponse("La valeur de la taille est requise", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("L'id du Billboard est requis", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: params.storeId,
                userId // === userId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Non autorisé.", { status: 403 })
        }

        const size =  await prismadb.size.updateMany({
            where: {
                id: params.sizeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.sizeId) {
            return new NextResponse("L'Id de la taille est requis", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: params.storeId,
                userId // === userId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Non autorisé.", { status: 403 })
        }

        // actions
        const size =  await prismadb.size.deleteMany({
            where: {
                id: params.sizeId
            },
        });

        // response
        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};