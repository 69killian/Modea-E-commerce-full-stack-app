import { redirect } from "next/navigation";
import prismadb from "@/prisma/prismadb";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {

  const authData = await auth();
  const { userId } = authData;

  if (!userId) {
    redirect("/sign-in");
  }


  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <div>This will be a NavBar</div>
      {children}
    </>
  );
}
