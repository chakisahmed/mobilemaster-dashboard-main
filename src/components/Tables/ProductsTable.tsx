"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { products, Product } from "@/utils/productsApi";
import { categories, Category } from "@/utils/categoriesApi";
import Link from "next/link";
import axios from "axios";
 

const ProductsTable = () => {
  const [categoriesData, setCategoriesData] = useState<Set<Category>>();
  const [productData, setProductData] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [currency, setCurrency] = useState<string>('');
  useEffect(() => {
    const fetchCurrency = async () => {
        const res = await axios.get('/api/isLogged');
        
        setCurrency(res.data.base_currency_symbol);
    };
    fetchCurrency();
}
, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      handlePageChange(1);
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  const fetchProducts = async (query: string) => {
    setLoading(true);

    try {
      const res = await products(query, currentPage);
      setProductData(res.items);
      setTotalCount(res.total_count);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
      console.log("debouncedSearchQuery", debouncedSearchQuery);
      fetchProducts(debouncedSearchQuery);
    
  }, [debouncedSearchQuery]);
  useEffect(() => {
    fetchProducts(searchQuery);
  }
  , [currentPage]);
    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categories();
        
        console.log("categories", JSON.stringify(res));
        /*
        {"id":2,"parent_id":1,"name":"Default Category","is_active":true,"position":1,"level":1,"product_count":28,"children_data":[{"id":3,"parent_id":2,"name":"Electronics","is_active":true,"position":1,"level":2,"product_count":27,"children_data":[{"id":4,"parent_id":3,"name":"Smartphones","is_active":true,"position":1,"level":3,"product_count":27,"children_data":[{"id":5,"parent_id":4,"name":"Android","is_active":true,"position":1,"level":4,"product_count":12,"children_data":[]},{"id":6,"parent_id":4,"name":"iOS","is_active":true,"position":2,"level":4,"product_count":15,"children_data":[]}]}]},{"id":7,"parent_id":2,"name":"Household","is_active":true,"position":2,"level":2,"product_count":0,"children_data":[{"id":8,"parent_id":7,"name":"Heavy household","is_active":true,"position":1,"level":3,"product_count":0,"children_data":[{"id":9,"parent_id":8,"name":"Fridge","is_active":true,"position":1,"level":4,"product_count":0,"children_data":[]},{"id":10,"parent_id":8,"name":"Stove","is_active":true,"position":2,"level":4,"product_count":0,"children_data":[]}]},{"id":11,"parent_id":7,"name":"Cooking devices","is_active":true,"position":2,"level":3,"product_count":0,"children_data":[{"id":12,"parent_id":11,"name":"Toaster","is_active":true,"position":1,"level":4,"product_count":0,"children_data":[]}]}]}]}
        */
       //flatten the category tree to a list of categories
        const flatten = (category: Category): Set<Category> => {
          let categories: Set<Category> = new Set([category]);
          for (const child of category.children_data) {
            const childCategories = flatten(child);
            childCategories.forEach(cat => categories.add(cat));
          }
          return categories;
        }
        const flatCategories = flatten(res);
        console.log("length", flatCategories.entries.length);

        

        setCategoriesData(flatCategories);

      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }
  , []);
  const renderPaginationButtons = () => {

    const totalPages = Math.ceil(totalCount / 20);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 5 ||
        i > totalPages - 5 ||
        (i >= currentPage - 3 && i <= currentPage + 3)
      ) {
        buttons.push(
          <button
            key={i}
            className={`mx-1 px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (
        (i === 6 && currentPage > 9) ||
        (i === totalPages - 5 && currentPage < totalPages - 8)
      ) {
        buttons.push(<span key={i} className="mx-1">...</span>);
      }
    }

    return buttons;
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const mapIdToCategory = (id: number) => {
    if (!categoriesData) return;  
    const category = Array.from(categoriesData).find((category: Category) => category.id === id);
    return category?.name;
  }
  return (
    

    <div className="relative rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {loading && (
        <div className="absolute inset-0 bg-black opacity-20 z-10 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}

     
      <div className="flex justify-end px-4 py-4.5 md:px-6 xl:px-9">
        <input
          type="text"
          placeholder="Search for products"
          className="w-full px-4 py-2 border border-stroke rounded-md dark:border-dark-3 dark:bg-dark-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Special Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">SKU</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      {productData.map((product, key) => (
        <div
          className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
          
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={"https://ext.web.wamia.tn/media/catalog/product"+ (product.media_gallery_entries.length>0? product.media_gallery_entries[0].file :"")}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {product.name}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.custom_attributes.find( 
                (attr) => attr.attribute_code === "category_ids"
              )?.value.map((id: string) => mapIdToCategory(Number(id))).slice(2).join(", ")}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.price} {currency}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {product?.custom_attributes.find((att) => att.attribute_code == "special_price")?.value 
                ? `${product.custom_attributes.find((att) => att.attribute_code == "special_price")?.value} ${currency}` 
                : ""}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.sku}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <Link className="text-body-sm font-medium text-green" href={`/product?sku=${product.sku}`}>
              View product
            </Link>
          </div>

        </div>
      ))}
      <div className="flex justify-center py-4">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default ProductsTable;
