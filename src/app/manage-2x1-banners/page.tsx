import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Categories from "@/components/Tables/Categories";
import Manage2x1Banners from "@/components/MobileApp/ManageBanners2xN";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const Manage2x1BannersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />

      <div className="flex flex-col gap-10">
        <Manage2x1Banners />
      </div>
    </DefaultLayout>
  );
};

export default Manage2x1BannersPage;
