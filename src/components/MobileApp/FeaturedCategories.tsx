"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertToBase64 } from '@/utils/file_utils';
import { categoriesByName as categoriesApi, Category } from '@/utils/categoriesApi';
import Select from 'react-select';
let RANGE = 8;

const FeaturedCategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [checkedCategories, setCheckedCategories] = useState<Set<number>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [catalogCategories, setCatalogCategories] = useState<Set<Category>>();
    const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<Category>();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    useEffect(() => {
        const fetchCatalogCategories = async () => {
            try {
                const response = await categoriesApi(debouncedSearchTerm);
                
                if (response) {
                    
                    setCatalogCategories(response.items);
                } else {
                    console.log("no data");
                }
            } catch (error: any) {
                console.error('Error fetching catalog categories:', error);
            }
        };
        fetchCatalogCategories();
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/featuredcategories');
                setCategories(response.data);
            } catch (error:any) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);
    const handleUpload = async () => {
        try {
            var response: any = null;
            if (editMode) {
                response = await axios.put(`/api/featuredcategories`, selectedCategory);

            } else {
                response = await axios.post('/api/featuredcategories', { ...(selectedCategory || {}), layout_type: 'featuredCategories' });
            }

            if (response != null) {
                if (editMode) {
                    setCategories(categories.map((category) => (category.id === response.data[0].id ? response.data[0] : category)));



                } else {
                    setCategories([...categories, response.data[0]]);
                }
            }
            setSelectedCategory(null);
            setIsModalOpen(false);
        } catch (error:any) {
            console.error('Error uploading category:', error);
        }
    }



    return (
        <div className=" bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <div className="mt-6">
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setEditMode(false);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-md"
                    >
                        Add Category
                    </button>
                    {checkedCategories.size > 0 && (
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete the selected categories?')) {
                                    try {
                                        checkedCategories.forEach(async (categoryId) => {
                                            await axios.delete(`/api/featuredcategories/${categoryId}`);
                                        });
                                        setCategories(categories.filter((category) => !checkedCategories.has(Number(category.id))));
                                        setCheckedCategories(new Set());
                                    } catch (error:any) {
                                        console.error('Error deleting categories:', error);
                                    }
                                }
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                        >
                            Delete Selected
                        </button>
                    )}
                </div>

                <div className="mt-7">
                    <table className="min-w-full divide-y divide-gray-200 mt-7">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedCategories.has(category.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCheckedCategories(new Set(checkedCategories).add(category.id));
                                                } else {
                                                    checkedCategories.delete(category.id);
                                                    setCheckedCategories(new Set(checkedCategories));
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={category.url} alt={category.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setEditMode(true);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-primary"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Category' : 'Add New Category'}</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={selectedCategory?.name}
                                onChange={(e) => {
                                    if (selectedCategory) {
                                        
                                        setSelectedCategory(
                                            { ...selectedCategory, 
                                                name: e.target.value, 
                                                url: selectedCategory?.url || '' }
                                            )}}
                                        }
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Category ID</label>
                            <Select
                                options={Array.from(catalogCategories || []).slice(0, 20).map(category => ({
                                    value: category.id,
                                    label: category.name
                                }))}
                                value={selectedCatalogCategory ? { value: selectedCatalogCategory.id, label: selectedCatalogCategory.name } : null}
                                onChange={(selectedOption) => {
                                    const selectedCategory = Array.from(catalogCategories || []).find(category => category.id === selectedOption?.value);
                                    setSelectedCatalogCategory(selectedCategory);
                                    if (selectedCategory)
                                    setSelectedCategory({ ...selectedCategory, category_id: selectedOption?.value });
                                }}
                                onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        convertToBase64(e.target.files[0]).then((base64) => {
                                            if (selectedCategory)
                                            setSelectedCategory({ ...selectedCategory, image: base64 });
                                        });
                                    }
                                }}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                            {editMode && selectedCategory?.image && (
                                <img src={selectedCategory.image} alt="Current Category" style={{ width: '100px', height: '100px' }} />
                            )}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => { setIsModalOpen(false); setSelectedCategory(null); }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                className="px-4 py-2 text-white bg-primary rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                            >
                                {editMode ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )};
        </div>
    );
}


export default FeaturedCategoriesPage;