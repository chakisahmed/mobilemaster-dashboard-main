import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ManageTags from "@/components/MobileApp/ManageTags";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const ManageTagsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Tags" />

      <div className="flex flex-col gap-10">
        <ManageTags />
      </div>
    </DefaultLayout>
  );
};

export default ManageTagsPage;

