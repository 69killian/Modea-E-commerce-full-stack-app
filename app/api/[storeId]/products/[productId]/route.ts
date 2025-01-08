import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        if (!params.productId) {
            return new NextResponse("L'id du Produit est requis", { status: 400});
        }

        
        // actions
        const product =  await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        // response
        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    props: { params: Promise<{ storeId: string, productId: string }> }
) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;
        const body = await req.json();

        const { name, 
            price, 
            categoryId, 
            colorId, sizeId, 
            images, isFeatured, 
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est requis.", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Des Images sont requis.", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Le Prix est requis.", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("L'Id de la Catégorie est requis.", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("L'Id de la Taille est requis.", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("L'Id de la Couleur est requis.", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("L'id du Produit est requis", { status: 400});
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

        await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {

                    }
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export async function DELETE(
    // to show that req isn't used, we can type "_req" instead
    req: Request,
    props: { params: Promise<{ storeId: string, productId: string }> }
) {
    const params = await props.params;
    try {
        const authData = await auth();
        const { userId } = authData;

        // checkings
        if (!userId) {
            return new NextResponse('Utilisateur Non Authentifié', { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("L'id du Produit est requis", { status: 400});
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
        const product =  await prismadb.product.deleteMany({
            where: {
                id: params.productId
            },
        });

        // response
        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};