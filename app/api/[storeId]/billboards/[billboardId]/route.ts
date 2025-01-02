import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("L'id du Billboard est requis", { status: 400});
        }

        
        // actions
        const billboard =  await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            },
        });

        // response
        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!label) {
            return new NextResponse("L'intitulé est requis", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("L'url de l'image est requis", { status: 400 });
        }

        if (!params.billboardId) {
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

        const billboard =  await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.billboardId) {
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

        // actions
        const billboard =  await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId
            },
        });

        // response
        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};