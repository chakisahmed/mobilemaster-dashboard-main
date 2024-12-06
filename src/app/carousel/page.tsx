import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Carousel from "@/components/MobileApp/Carousel";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const CarouselPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Carousel" />

      <div className="flex flex-col gap-10">
        <Carousel />
      </div>
    </DefaultLayout>
  );
};

export default CarouselPage;
