// src/components/ActiveViewRenderer.tsx
"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ECommerce from "@/components/Dashboard/E-commerce";
import Products from "@/components/Tables/ProductsTable";
import Categories from "./Tables/Categories";
import AppCreator from "./MobileApp/AppCreator";
import ManageTags from "./MobileApp/ManageTags";
import ManageBanners from "./MobileApp/ManageBanners";
import FeaturedCategoriesPage from "./MobileApp/FeaturedCategories";
import Carousel from "./MobileApp/Carousel";
import Walkthrough from "./MobileApp/Walkthrough";
import ProductDetails from "./Catalog/ProductDetails";
import Manage2x2Banners from "./MobileApp/ManageBanners2xN";
// Import additional components as needed
/**
 * customize home page
manage home page tags
manage banners
manage featured categories
manage featured products
manage walkthrough 
 */
const ActiveViewRenderer = () => {
  const view = useSelector((state: RootState) => state.activeView.view);


  switch (view) {
    case "dashboard":
      return <ECommerce />;
    case "products":
      return <Products />;
    case "categories":
        return <Categories />;
    case "customize home page":
        return <AppCreator />;
    case "manage home page tags":
        return <ManageTags />;
    case "manage banners":
        return <ManageBanners />;
    case "manage secondary banners":
        return <Manage2x2Banners bannerGroup={""}/>;
    case "manage featured categories":
        return <FeaturedCategoriesPage />;
    case "manage featured products":
        return <Carousel />;
    case "manage walkthrough":
        return <Walkthrough />;
    case "product details":
        return <ProductDetails />;

    default:
      return <ECommerce />;
  }
};

export default ActiveViewRenderer;
