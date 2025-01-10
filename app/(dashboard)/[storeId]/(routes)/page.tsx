import { Heading } from "@/components/ui/Heading";
import { Separator } from "@radix-ui/react-separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count copy";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

// Le paramètre `storeId` est directement récupéré dans les params
export default async function DashboardPage({ params }: { params: Promise<{ storeId: string }> }) {
  // Extraction du storeId
  const { storeId } = await params;

  // Appels API pour récupérer les données
  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);

  return (
    <div className="flex-col p-6 ">
      <div className="flex-1 space-y-4 py-8 pt-6">
        <Heading title="Dashboard" description="Vue d'ensemble de votre Boutique" />
        <Separator />
        <div className="grid gap-4 grid-cols-3 ">
        <Card
            className="transition-colors duration-300 dark:bg-[#003956] p-1 shadow-md border-t-2 border-gray-300/10 dark:shadow-[inset_0_-20px_20px_rgba(0,0,0,0.4)]"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#007fff]">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card
            className="transition-colors duration-300 dark:bg-[#0f2d13] p-1 shadow-md border-t-2 border-gray-300/10 dark:shadow-[inset_0_-20px_50px_rgba(0,0,0,0.6)]"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00561b]">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card
            className="transition-colors duration-300 dark:bg-[#1e1e1e] p-1 shadow-md border-t-2 border-gray-300/10 dark:shadow-[inset_0_-20px_20px_rgba(0,0,0,0.4)]"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits en Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card
            className="col-span-4 transition-colors duration-300 dark:bg-[#1e1e1e]  p-1 shadow-md border-t-2 border-gray-300/10"
        >
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
