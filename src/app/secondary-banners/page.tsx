import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Manage2x2Banners from "@/components/MobileApp/ManageBanners2xN";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const Manage2x2BannersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Secondary Banners" />

      <div className="flex flex-col gap-10">
        <Manage2x2Banners bannerGroup={''}/>
      </div>
    </DefaultLayout>
  );
};

export default Manage2x2BannersPage;
