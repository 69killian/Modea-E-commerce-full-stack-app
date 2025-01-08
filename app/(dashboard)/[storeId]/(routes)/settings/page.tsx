import prismadb from "@/prisma/prismadb";
import { redirect } from "next/dist/server/api-utils";
import { auth } from "@clerk/nextjs/server";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const Settingspage: React.FC<SettingsPageProps> = async props => {
    const params = await props.params;
    const authData = await auth();
    const { userId } = authData;

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect("/");
    }

    return (
      <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
              <SettingsForm initialData={store}/>
          </div>
      </div>
    )
}

export default Settingspage;