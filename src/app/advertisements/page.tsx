import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Categories from "@/components/Tables/Categories";
import Advertisements from "@/components/MobileApp/Advertisements";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AdvertisementsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />

      <div className="flex flex-col gap-10">
        <Advertisements />
      </div>
    </DefaultLayout>
  );
};

export default AdvertisementsPage;
