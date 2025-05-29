"use client";
import { use, useEffect, useState } from "react";
import SwitcherOne from "@/components/FormElements/Switchers/SwitcherOne";

import RichTextEditor from '../WYSIWYG/RichTextEditor';

import { categories, Category, categoryById, CategoryDeatils } from "@/utils/categoriesApi";
//create categories tree data


const renderCategories = (category: Category, expandedCategories: any, toggleExpand: any, setCurrentCategoryId:any) => {
  const isExpanded = expandedCategories.includes(category.id);
  const fontSize = 22 - category.level * 2; // Adjust font size based on category level

  return (
    <div style={{ margin: "5px", marginLeft: "20px", padding: "10px", paddingLeft: '0px', position: "relative" }}>
      <div style={{ borderLeft: "2px solid #ccc", height: "100%", position: "absolute", left: "-20px", top: "0" }}></div>
      <ul>
        <li>
          <span onClick={()=> setCurrentCategoryId(category.id)} style={{ cursor: "pointer", color: "#007bff", fontSize: `${fontSize}px` }}>
            {category.name} 
          </span>
          <span onClick={() => toggleExpand(category.id)} style={{ cursor: "pointer", color: "#007bff", fontSize: `${fontSize}px` }}>
             {category.children_data.length > 0 && (isExpanded ? "[-]" : "[+]")}
          </span>
        </li>
      </ul>
      {isExpanded && category.children_data.length > 0 && (
        <div style={{ paddingLeft: "20px" }}>
          {category.children_data.map((child: any) => (
            <div key={child.id}>
              {renderCategories(child, expandedCategories, toggleExpand,setCurrentCategoryId)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Categories = () => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([2]);
  const [categoriesData, setCategoriesData] = useState<Category>();
  const [currentCategoryId,setCurrentCategoryId] = useState<number>(2);
  const [currentCategory, setCurrentCategory] = useState<CategoryDeatils>();
  const [uploadedImage, setUploadedImage] = useState<Record<string, string>>({image:'',magefan_og_image:''});
  const [isActive, setIsActive] = useState<boolean>(false);
  const [includeInMenu, setIncludeInMenu] = useState<boolean>(false);
  const handleIsActiveChange = (value: boolean) => {
    setIsActive(value);
  };

  const handleIncludeInMenuChange = (value: boolean) => {
    setIncludeInMenu(value);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>,attribute_code:string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({ ...uploadedImage, [attribute_code]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categories();
        setCategoriesData(res);
      } catch (error:any) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCategoryById = async () => {
      try {
        const res = await categoryById(currentCategoryId);
        console.log(res.name);
        setCurrentCategory(res);
      } catch (error:any) {
        console.log(error);
      }
    }
    fetchCategoryById();
  }, [currentCategoryId]);
  const toggleExpand = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };
  const includeCustomAttributes = ['image','description','url_key','is_active','magefan_og_image'];
  //const includeCustomAttributes = ['url_key'];
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card" style={{ display: "flex" }}>
      <div className="px-4 py-6 md:px-6 xl:px-9" style={{ width: "30%" }}>
      <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
        Expendable Categories Tree
      </h4>
      {categoriesData != null && renderCategories(categoriesData, expandedCategories, toggleExpand,setCurrentCategoryId)}
      </div>
      <div className="px-4 py-6 md:px-6 xl:px-9" style={{ width: "70%" }}>
      <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
        Category Details
      </h4>
      <div>
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Category Name
          </label>
          <input
        type="text"
        value={currentCategory?.name || ""}
        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        readOnly
          />
        </div>
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Category Id
          </label>
          <input
        type="text"
        value={currentCategory?.id || ""}
        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        readOnly
          />
        </div>
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Parent Id
          </label>
          <input
        type="text"
        value={currentCategory?.parent_id || ""}
        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        readOnly
          />
        </div>
        <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Is Active
        </label>
        <SwitcherOne id="is-active-switch" onChange={handleIsActiveChange} />
      </div>
      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Include In Menu
        </label>
        <SwitcherOne id="include-in-menu-switch" onChange={handleIncludeInMenuChange} />
      </div>
        <div>
          
          <ul>
        {includeCustomAttributes.map((attribute,index) => {
          const attValue = currentCategory?.custom_attributes.find((att) => att.attribute_code == attribute)?.value ?? '';
          console.log(attValue);
            
            return <li key={currentCategory?.custom_attributes.find((att) => att.attribute_code == attribute)?.attribute_code}>
              <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {attribute}
          </label>
          
          {attribute=='description'? <RichTextEditor initialValue={attValue} />
          :['image','magefan_og_image'].includes(attribute)?
          <div>
                  <input
        type="file"
        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
        onChange={(event) => handleFileChange(event,attribute)}
      />
      <img
        src={uploadedImage[attribute] || `https://www.wamia.tn/${attValue.includes('/media/catalog/category/') ? '' : 'media/catalog/category/'}${attValue}`}
        alt={attribute}
        className="h-30 pt-2"
      />
          </div>
          :<input
            type="text"
            value={attValue}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            readOnly
          />
          }
          </div>
            </li>
})}
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Categories;
