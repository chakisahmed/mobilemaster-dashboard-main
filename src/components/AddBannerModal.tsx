import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertToBase64 } from '@/utils/file_utils';
import SelectGroupOne from './FormElements/SelectGroup/SelectGroupOne';
import CustomSelectGroup from './FormElements/SelectGroup/CustomSelectGroup';
import { Product, products } from '@/utils/productsApi';
import { categoriesByName, Category } from '@/utils/categoriesApi';
import Select from 'react-select';

interface AddBannerModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    onBannerAdded: (banner: any) => void;
    banner?: any; // Optional banner prop for editing
    editMode: boolean;
}

export default function AddBannerModal({
    isModalOpen,
    setIsModalOpen,
    onBannerAdded,
    banner,
    editMode,
}: AddBannerModalProps) {
    const [newBanner, setNewBanner] = useState({
        id: 0,
        name: '',
        image: null as File | null,
        banner_type: '',
        catalog_id: 0,
        status: 0,
        order: 0,
    });
    const [catalogProducts, setCatalogProducts] = useState<Product[]>();
    const [catalogCategories, setCatalogCategories] = useState<Category[]>();
    const [searchTerm, setSearchTerm] = useState('');
    const [catalogType, setCatalogType] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const fetchProducts = async (query: string) => {

        try {
            if (catalogType === 'category') {
                const res = await categoriesByName(query);
                setCatalogCategories(res.items);
            } else if (catalogType === 'product') {
                const res = await products(query, 1);
                setCatalogProducts(res.items);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
        }
    };
    useEffect(() => {

        console.log("debouncedSearchQuery", debouncedSearchTerm);
        console.log("catalogType", catalogType);
        fetchProducts(debouncedSearchTerm);

    }, [debouncedSearchTerm,catalogType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }
        , [searchTerm]);

    useEffect(() => {
        if (editMode && banner) {
            setNewBanner(banner);
        } else {
            setNewBanner({
                id: 0,
                name: '',
                image: null,
                banner_type: '',
                catalog_id: 0,
                status: 0,
                order: 0,
            });
        }
    }, [editMode, banner]);
    const handleSelect = (value: string) => {
        setNewBanner({ ...newBanner, banner_type: value });
        setCatalogType(value);
    };

    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', newBanner.name);
            formData.append('banner_type', newBanner.banner_type);
            formData.append('layout_type', 'bannerimages');
            formData.append('catalog_id', newBanner.catalog_id);
            formData.append('order', '0'); // Order should be a string to append to FormData
            formData.append('status', '1');
            let response;
            // Convert image to base64 if there is an image
            if (newBanner.image) {
                const base64String = await convertToBase64(newBanner.image);
                console.log('Base64 image:', base64String.substring(0, 100));
                formData.append('image', base64String);
            }
            console.log('newBanner:', newBanner.id);

            if (editMode) {
                response = await axios.put(`/api/banners/create/${newBanner.id}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                response = await axios.post('/api/banners/create', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }



            onBannerAdded(response.data);

            //   Close the modal and reset the form
            setIsModalOpen(false);
            resetForm();

        } catch (error) {
            console.error('Failed to create banner', error);
        }
    };

    const resetForm = () => {
        setNewBanner({
            id: 0,
            name: '',
            image: null,
            banner_type: '',
            catalog_id: 0,
            status: 0,
            order: 0,
        });
    };



    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4">{banner ? 'Edit Banner' : 'Add New Banner'}</h2>
                    <form onSubmit={handleAddBanner}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={newBanner.name}
                                onChange={(e) => setNewBanner({ ...newBanner, name: e.target.value })}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Banner Type</label>
                            <CustomSelectGroup options={["product", "category"]} onSelect={handleSelect} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Catalog ID</label>
                            <Select
                                options={newBanner.banner_type === 'product' ? catalogProducts?.map((product) => ({ value: product.id, label: product.name })) : catalogCategories?.map((category) => ({ value: category.id, label: category.name }))}
                                onChange={(selectedOption) => {
                                    setNewBanner({ ...newBanner, catalog_id: selectedOption.value });
                                }}
                                placeholder="Select catalog ID"
                                isSearchable
                                isClearable
                                onInputChange={(inputValue) => setSearchTerm(inputValue)}


                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setNewBanner({ ...newBanner, image: e.target.files[0] });
                                    }
                                }}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {editMode && newBanner.image && (
                                <img src={newBanner.image} alt="Current Banner" style={{ width: '100px', height: '100px' }} />
                            )}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {editMode ? 'Update Banner' : 'Add Banner'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}