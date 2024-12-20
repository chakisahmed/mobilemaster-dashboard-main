import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AppCreator from "@/components/MobileApp/AppCreator";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AppCreatorPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="AppCreator" />

      <div className="flex flex-col gap-10">
        <AppCreator />
      </div>
    </DefaultLayout>
  );
};

export default AppCreatorPage;