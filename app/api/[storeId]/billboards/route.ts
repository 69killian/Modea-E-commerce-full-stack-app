import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ storeId: string }>}) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Non Authentifié.', { status: 401 });
        }

        if (!label) {
            return new NextResponse("L'intitulé est requis.", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("L'Url de l'image est requis.", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("L'id de la Boutique est requis.", { status: 400 })
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

        const billboard =  await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARDS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};


export async function GET(req: Request, props: { params: Promise<{ storeId: string }>}) {
    const params = await props.params;
    try {

        if (!params.storeId) {
            return new NextResponse("L'id de la Boutique est requis.", { status: 400 })
        }

        const billboards =  await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log("[BILLBOARDS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
