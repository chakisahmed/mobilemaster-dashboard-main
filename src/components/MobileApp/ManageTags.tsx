"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { convertToBase64 } from '@/utils/file_utils';
import { categoriesByName as categoriesApi, Category } from '@/utils/categoriesApi';
import { deleteTagsData, getTagsData, postTagsData, TagsType } from '@/utils/tagsApi';

const ManageTags = () => {
    const [tags, setTags] = useState<TagsType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTag, setNewTag] = useState<{ name: string; image?: string; category_id?: number }>({ name: '' });
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
        const getTags = async () => {
            const response = await getTagsData();
            setTags(response);
        };
        getTags();
    }, []);

    const handleCreateTag = async () => {
        try {
            const response = await postTagsData({ ...newTag, image: newTag.image || undefined, category_id: newTag.category_id?.toString() || '' });
            setTags([...tags, response]);
            setIsModalOpen(false);
            setNewTag({ name: '' });
        } catch (error: any) {
            console.error('Error creating tag:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Create Tag
            </button>
            <table className="min-w-full divide-y divide-gray-200 mt-7">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map((tag) => (
                        <tr key={tag.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {tag.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {tag.image!=null && <img src={tag.image} alt={tag.name} className="w-16 h-16 object-cover" />}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tag.category_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={async () => {
                                        await deleteTagsData(tag.id);
                                        setTags(tags.filter((t) => t.id !== tag.id));
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">Create New Tag</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={newTag.name}
                                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
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
                                    setNewTag({ ...newTag, category_id: selectedOption?.value });
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
                                            setNewTag({ ...newTag, image: base64 });
                                        });
                                    }
                                }}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
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
                                type="button"
                                onClick={handleCreateTag}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageTags;