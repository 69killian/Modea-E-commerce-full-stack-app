import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ storeId: string }>}) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Non Authentifié.', { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est requis.", { status: 400 });
        }

        if (!value) {
            return new NextResponse("La valeur de l'image est requise.", { status: 400 });
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

        const color =  await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLORS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};


export async function GET(req: Request, props: { params: Promise<{ storeId: string }>}) {
    const params = await props.params;
    try {

        if (!params.storeId) {
            return new NextResponse("L'id de la Boutique est requis.", { status: 400 })
        }

        const colors =  await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(colors);

    } catch (error) {
        console.log("[COLORS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
