import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    props: { params: Promise<{ colorId: string }> }
) {
    const params = await props.params;
    try {
        if (!params.colorId) {
            return new NextResponse("L'id de la Taille est requis", { status: 400});
        }

        
        // actions
        const color =  await prismadb.color.findUnique({
            where: {
                id: params.colorId
            },
        });

        // response
        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    props: { params: Promise<{ storeId: string, colorId: string }> }
) {
    const params = await props.params;
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
            return new NextResponse("La valeur de la Couleur est requise", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("L'id de la Couleur est requis", { status: 400});
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

        const color =  await prismadb.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    props: { params: Promise<{ storeId: string, colorId: string }> }
) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.colorId) {
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
        const color =  await prismadb.color.deleteMany({
            where: {
                id: params.colorId
            },
        });

        // response
        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};