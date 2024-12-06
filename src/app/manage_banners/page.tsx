import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ManageBanners from "@/components/MobileApp/ManageBanners";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const ManageBannersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Banners" />

      <div className="flex flex-col gap-10">
        <ManageBanners />
      </div>
    </DefaultLayout>
  );
};

export default ManageBannersPage;

