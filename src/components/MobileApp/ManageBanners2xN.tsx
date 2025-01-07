"use client";
import React, { useState, useEffect, use } from 'react';
import axios from 'axios';

import { convertToBase64 } from '../../utils/file_utils';
import { categoriesByName as categoriesApi, Category } from '@/utils/categoriesApi';
import { Product, products } from '@/utils/productsApi';
import Select from 'react-select';

interface Manage2x2BannersProps {
  bannerGroup: any; // Replace 'any' with the appropriate type if known
}

const Manage2x2Banners = ({ bannerGroup }: Manage2x2BannersProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedBanners.map((id) =>
        axios.delete(`/api/banners2xn/create/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    );

    setBanners((prevBanners) =>
      prevBanners.filter((banner) => !selectedBanners.includes(banner.id))
    );
    setSelectedBanners([]);
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/banners2xn/create/banner2x2');
        const bannerContainers = response.data;

        const bannersWithItems = await Promise.all(
          bannerContainers.map(async (banner: any) => {
            const items = await fetchBannerItems(banner.layout_type + '-' + banner.id);
            return { ...banner, items };
          })
        );

        setBanners(bannersWithItems);
      } catch (error: any) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, []);

  const fetchBannerItems = async (layoutType: any) => {
    try {
      const response = await axios.get(`/api/banners2xn/banner/${layoutType}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching banners for layout type ${layoutType}:`, error);
      return [];
    }
  };

  const handleEditBanner = (banner: any) => {
    setBannerToEdit(banner);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id: any) => {
    setSelectedBanners((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((bannerId) => bannerId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb">
          <ul className="flex space-x-2 text-gray-600">
            <li className="flex items-center">

              <a href="/manage-banners" className="hover:underline">Manage Banners</a>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>


            <li className="flex items-center">
              <span className="text-gray-500">Secondary Banners</span>

            </li>

          </ul>
        </nav>

        <h1 className="text-4xl font-bold text-center mb-8">Secondary Banners</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setBannerToEdit(null); // Reset bannerToEdit when creating a new banner
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700"
          >
            Create Banner
          </button>

          {selectedBanners.length > 0 && (
            <button
              className="ml-2 px-4 py-2 text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Select</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedBanners.includes(banner.id)}
                      onChange={() => handleCheckboxChange(banner.id)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">{banner.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      {banner.items && banner.items.map((item: any, index: number) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="w-auto h-12 object-cover"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditBanner(banner)}
                      className="px-2 py-1 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && <CreateBannerModal
          setIsModalOpen={setIsModalOpen}
          setBanners={setBanners}
          bannerGroup={bannerGroup}
          bannerToEdit={bannerToEdit} // Pass the banner to edit
        />}
      </div>
    </div>
  );
};

interface CreateBannerModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBanners: React.Dispatch<React.SetStateAction<any[]>>;
  bannerGroup: any; // Replace 'any' with the appropriate type if known
  bannerToEdit: any; // Replace 'any' with the appropriate type if known
}

const CreateBannerModal = ({ setIsModalOpen, setBanners, bannerGroup, bannerToEdit }: CreateBannerModalProps) => {
  const [name, setName] = useState(bannerToEdit ? bannerToEdit.name : '');
  const [images, setImages] = useState(bannerToEdit ? bannerToEdit.items.map((item: any) => ({
    image: item.image,
    banner_type: item.banner_type || 'category',
    catalog_id: item.catalog_id || '',
    name: item.name || ''
  })) : [
    { image: null, banner_type: 'category', catalog_id: '', name: '' },
    { image: null, banner_type: 'category', catalog_id: '', name: '' },
    { image: null, banner_type: 'category', catalog_id: '', name: '' },
    { image: null, banner_type: 'category', catalog_id: '', name: '' }
  ]);
  const [searchTerm, setSearchTerm] = useState<string[]>(['', '', '', '']);
  const [catalogType, setCatalogType] = useState(['category', 'category', 'category', 'category']);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string[]>(['', '', '', '']);
  const [catalogProducts, setCatalogProducts] = useState<{[key: number]:Product[]}>(
    {
      0: [] as Product[],
      1: [] as Product[],
      2: [] as Product[],
      3: [] as Product[],
    }
  );
  const [catalogCategories, setCatalogCategories] = useState<{ [key: number]: Category[] }>({
    0: [] as Category[],
    1: [] as Category[],
    2: [] as Category[],
    3: [] as Category[],
  });
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<{ [key:number]: Category | null}>(
    {
      0: null,
      1: null,
      2: null,
      3: null,
    }
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{[key:number]: Product | null}>(
    {
      0: null,
      1: null,
      2: null,
      3: null
    }
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const fetchProducts = async (query: string, index: number) => {
    try {
      if (catalogType[index] === 'category') {
        const res = await categoriesApi(query);
        if(res && res.items)
        setCatalogCategories({
          ...catalogCategories,
          [index]: res.items,});
      } else if (catalogType[index] === 'product') {
        const res = await products(query, 1);
        const productsRes = {
          ...catalogProducts,
          [index]: res.items,
        };
        console.log('productsRes:', productsRes);
        setCatalogProducts(productsRes);
      }
    } catch (error: any) {
      console.log(error);
    }
    finally {
    }
  };
  useEffect(() => {
    if(debouncedSearchTerm[focusedIndex] !== '')
    {
      console.log('fetching products with', debouncedSearchTerm[focusedIndex]);
      fetchProducts(debouncedSearchTerm[focusedIndex], focusedIndex);
    
    }

  }, [debouncedSearchTerm, catalogType]);

  useEffect(() => {
    const initSelectCategoryItems = async () => {
      try {
        const res = await categoriesApi('');
        setCatalogCategories({
          ...catalogCategories,
          [0]: res.items,
          [1]: res.items,
          [2]: res.items,
          [3]: res.items,
        });
      } catch (error: any) {
        console.log(error);
      }
    }
    initSelectCategoryItems();

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }
    , [searchTerm]);

  const handleImageChange = (index: number, file: File) => {
    convertToBase64(file).then((base64String) => {
      console.log('file before:', file);
      console.log('Base64 image:', base64String);
    });
    const newImages = [...images];
    newImages[index].image = file;
    setImages(newImages);
  };

  const handleBannerTypeChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].banner_type = value;
    setCatalogType(newImages.map((image) => image.banner_type));
    setImages(newImages);
  };

  const handleCatalogIdChange = (index: number, value: number | null) => {
    const newImages = [...images];
    newImages[index].catalog_id = value;
    setImages(newImages);
  };

  const handleNameChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index].name = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Custom validation to ensure at least one file input is filled
    const isAtLeastOneFileSelected = images.some((image: { image: null; }) => image.image !== null);
    if (!isAtLeastOneFileSelected) {
      alert('Please select at least one image.');
      return;
    }

    try {
      let response;
      if (bannerToEdit) {
        response = await axios.put(`/api/banners2xn/create/${bannerToEdit.id}`, { name: name, layout_type: 'banner2x2' });
      } else {
        response = await axios.post('/api/banners2xn/create', { name: name, order: -1, layout_type: 'banner2x2' });
      }
      const bannerGroup = response.data;
      let i = 1;
      for (const image of images) {
        if (image.image) {
          const formData = new FormData();
          formData.append('name', image.name);
          formData.append('banner_type', image.banner_type);
          formData.append('catalog_id', image.catalog_id);
          formData.append('order', i.toString());
          formData.append('status', '1');
          formData.append('layout_type', 'banner2x2-' + bannerGroup.id);

          if(image.image && image.image instanceof File) {
            const base64String = await convertToBase64(image.image);
          console.log('Base64 image:', base64String.substring(0, 100));
          formData.append('image', base64String);
        }
          console.log(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
          let response;

          if (bannerToEdit) {
            // Update existing image
            response = await axios.put(`/api/banners/create/${bannerToEdit.items[i - 1].id}`, formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } else {
            // Create new image
            response = await axios.post('/api/banners/create', formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
          // let responseimage = response.data.image; // ex: /media/banners/category/1.jpg 
          // //download image to local image folder in public /media/banners/
          


          i++;
        }
      }
      setBanners((prevBanners) => [
        ...prevBanners,
        { id: bannerGroup.id, name, status: '1' },
      ]);

      setIsModalOpen(false);
      //refresh the page  
      //window.location.reload();
    } catch (error: any) {
      console.error('Error creating banner:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {images.map((image: { image: string | Blob | MediaSource | undefined; banner_type: string | number | readonly string[] | undefined; catalog_id: string | number | readonly string[] | undefined; name: string | number | readonly string[] | undefined; }, index: number) => (
              <div key={index} className="flex flex-col items-center">
                {image.image && (
                  <img
                    src={typeof image.image === 'string' ? image.image : URL.createObjectURL(image.image)}
                    alt="Preview"
                    className="mb-2"
                    style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    console.log(index);
                    if (e.target.files && index !== undefined)
                      handleImageChange(index, e.target.files[0]);
                  }}
                  className="border p-1 w-full"
                />
                <select
                  value={image.banner_type}
                  onChange={(e) => handleBannerTypeChange(index, e.target.value)}
                  className="border p-1 mt-1 w-full"
                >
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                </select>



                {image.banner_type!=null && <Select
                                options={image.banner_type === 'product' ? catalogProducts[index].map((product) => ({ value: product.id, label: product.name })) : catalogCategories[index].map((category) => ({ value: category.id, label: category.name }))}
                                onChange={(selectedOption) => {
                                    if (selectedOption) {
                                      if(image.banner_type === "category") {
                                        const selectedCategory = Array.from(catalogCategories[index] || []).find(category => category.id === selectedOption.value);
                                        setSelectedCatalogCategory((prev) => ({ ...prev, [index]: selectedCategory! }));
                                        if (selectedCategory) handleCatalogIdChange(index, selectedCategory.id);
                                      } else if(image.banner_type === "product") {
                                        const selectedProduct = Array.from(catalogProducts[index] || []).find(product => product.id === selectedOption.value);
                                        setSelectedProduct((prev) => ({ ...prev, [index]: selectedProduct! }));
                                        if (selectedProduct) handleCatalogIdChange(index, selectedProduct.id);
                                      }
                                    } else {
                                      // Handle clear action
                                      setSelectedCatalogCategory((prev) => ({ ...prev, [index]: null }));
                                      setSelectedProduct((prev) => ({ ...prev, [index]: null }));
                                      handleCatalogIdChange(index, null);
                                    }
                                }}
                                value={
                                  image.banner_type === 'product' 
                                  ? (selectedProduct[index]?.id ? { value: selectedProduct[index]?.id, label: selectedProduct[index]?.name } 
                                  : null) 
                                  : 
                                  (selectedCatalogCategory[index]?.id 
                                    ? { value: selectedCatalogCategory[index]?.id, 
                                      label: selectedCatalogCategory[index]?.name 
                                    } : null)}

                                placeholder="Select catalog ID"
                                isSearchable
                                isClearable
                                onInputChange={(inputValue) => {
                                  setFocusedIndex(index);
                                  console.log('focusedIndex:', focusedIndex);
                                  setSearchTerm({ ...searchTerm, [index]: inputValue })}}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"



                            />}
                {/* <Select
                                options={image.banner_type === 'product' ? catalogProducts[index].map((product) => ({ value: product.id, label: product.name })) : catalogCategories[index].map((category) => ({ value: category.id, label: category.name }))}

                                
                                value={selectedCatalogCategory[index] ? { value: selectedCatalogCategory[index].id, label: selectedCatalogCategory[index].name } : null}
                                onChange={(selectedOption) => {
                                    const selectedCategory = Array.from(catalogCategories[index] || []).find(category => category.id === selectedOption?.value);
                                    setSelectedCatalogCategory((prev) => ({ ...prev, [index]: selectedCategory }));
                                    if (selectedCategory)
                                    handleCatalogIdChange(index, selectedCategory.id);
                                }}
                                onInputChange={(inputValue) => {
                                    const newSearchTerm = [...searchTerm];
                                    newSearchTerm[index] = inputValue;
                                    setSearchTerm(newSearchTerm);
                                }}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            /> */}



                            
                <input
                  type="text"
                  value={image.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Name"
                  className="border p-1 mt-1 w-full"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Manage2x2Banners;