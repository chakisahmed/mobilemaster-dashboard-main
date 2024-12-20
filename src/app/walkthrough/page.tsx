import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Walkthrough from "@/components/MobileApp/Walkthrough";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const WalkthroughsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Walkthroughs" />

      <div className="flex flex-col gap-10">
        <Walkthrough />
      </div>
    </DefaultLayout>
  );
};

export default WalkthroughsPage;
