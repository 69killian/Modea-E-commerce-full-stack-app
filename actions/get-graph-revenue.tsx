import prismadb from "@/prisma/prismadb";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems : {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber();
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    };

    const graphData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Fev', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Avr', total: 0 },
        { name: 'Mai', total: 0 },
        { name: 'Juin', total: 0 },
        { name: 'Juil', total: 0 },
        { name: 'Aou', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
    ];

    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
}