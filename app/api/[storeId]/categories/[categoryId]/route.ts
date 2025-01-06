import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { categoryId: string } }
) {
    try {
        if (!params.categoryId) {
            return new NextResponse("L'id de la catégorie est requis", { status: 400});
        }

        
        // actions
        const category =  await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            },
            include: {
                billboard: true,
            }
        });

        // response
        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est requis", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("L'id du Billboard est requis", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("L'id de la Catégorie est requis", { status: 400});
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

        const category =  await prismadb.category.updateMany({
            where: {
                id: params.categoryId
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    // params have to be the second argument
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("L'id de la catégorie est requis", { status: 400});
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
        const category =  await prismadb.category.deleteMany({
            where: {
                id: params.categoryId
            },
        });

        // response
        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};