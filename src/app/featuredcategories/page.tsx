import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import FeaturedCategories from "@/components/MobileApp/FeaturedCategories";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const FeaturedCategoriesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Featured Categories" />

      <div className="flex flex-col gap-10">
        <FeaturedCategories />
      </div>
    </DefaultLayout>
  );
};

export default FeaturedCategoriesPage;
