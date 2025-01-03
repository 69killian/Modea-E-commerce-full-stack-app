import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('Non Authentifié.', { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est requis.", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("L'Id du Billboard est requis.", { status: 400 });
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

        const category =  await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};


export async function GET(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    try {

        if (!params.storeId) {
            return new NextResponse("L'id de la Boutique est requis.", { status: 400 })
        }

        const categories =  await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
