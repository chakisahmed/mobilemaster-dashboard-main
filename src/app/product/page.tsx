
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProductDetails from "@/components/Catalog/ProductDetails";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const ProductsPage = () => {


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product" />
      <div className="flex flex-col gap-10">
        <ProductDetails/>
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;