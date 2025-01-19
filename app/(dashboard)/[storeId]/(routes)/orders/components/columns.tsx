import { ColumnDef } from "@tanstack/react-table";

export interface OrderColumn {
  id: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  isPaid: boolean;
  createdAt: string;
}


export const columns: ColumnDef<OrderColumn>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
      header: "Produits",
      accessorKey: "products",
  },
    {
        header: "Téléphone",
        accessorKey: "phone",
    },
    {
        header: "Adresse",
        accessorKey: "address",
    },
    {
      header: "Status",
      accessorKey: "isPaid",
      cell: ({ row }) => {
          const isPaid = row.getValue("isPaid");
          return (
              <button
                  className={`px-4 py-0 dark:text-gray-300 dark:border  text-[12px] rounded-full ${
                      isPaid ? "dark:border-green-500/20 dark:text-green-500/90 border border-green-900/30 text-green-900 dark:bg-green-500/20 bg-green-500/60" : "dark:border-red-500/20 dark:text-red-500/90 border border-red-900/30 text-red-900 dark:bg-red-500/20 bg-red-500/60 "
                  }`}
              >
                  {isPaid ? "Payé" : "Impayé"}
              </button>
          );
      },
  },
    {
        header: "Prix Total",
        accessorKey: "totalPrice",
    },
];
