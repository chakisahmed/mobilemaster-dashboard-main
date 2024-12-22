"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { convertToBase64 } from '../file_utils';
let RANGE = 8;
interface GroupContainer {
    id: string;
    name: string;
    layout_type: string;
}

interface FeaturedCategory {
    id: string;
    name: string;
    url: string;
}

const FeaturedCategories4xNPage: React.FC = () => {
    const [groupContainers, setGroupContainers] = useState<GroupContainer[]>([]);
    const [featuredCategories, setFeaturedCategories] = useState<{ [key: string]: FeaturedCategory[] }>({});
    const [showModal, setShowModal] = useState(false);
    const [newCategories, setNewCategories] = useState<FeaturedCategory[]>([
        { id: '', name: '', url: '' },
        { id: '', name: '', url: '' },
        { id: '', name: '', url: '' },
        { id: '', name: '', url: '' }
    ]);
    const [layoutName, setLayoutName] = useState('');

    const [images, setImages] = useState<(string | ArrayBuffer | null)[]>(Array(RANGE).fill(null));
    const [base64Images, setBase64Images] = useState<string[]>(Array(RANGE).fill(''));
    const [names, setNames] = useState<string[]>(Array(RANGE).fill(''));
    const [ids, setIds] = useState<string[]>(Array(RANGE).fill(''));
    useEffect(() => {
        const fetchGroupContainers = async () => {
            try {
                const response = await axios.get('/api/featuredcategories4xn/featuredcategories4x2');
                const data: GroupContainer[] = response.data;
                setGroupContainers(data);

                // Fetch images for each group container
                const categoriesPromises = data.map(async (container) => {
                    const res = await axios.get(`/api/featuredcategories/${container.layout_type}-${container.id}`);
                    return { [container.id]: res.data };
                });

                const categoriesData = await Promise.all(categoriesPromises);
                const categoriesMap = categoriesData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setFeaturedCategories(categoriesMap);
            } catch (error) {
                console.error('Error fetching group containers:', error);
            }
        };

        fetchGroupContainers();
    }, []);
 

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files[0];
        //console.log('File:', file);
        if (file) {

            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...images];
                newImages[index] = reader.result;
                //console.log('New Image:', reader.result);
                setImages(newImages);
            };
            reader.readAsDataURL(file);
            convertToBase64(file).then((base64) => {
                const newBase64Images = [...base64Images];
                newBase64Images[index] = base64;
                console.log('Base64:', base64);
                setBase64Images(newBase64Images);
            });

        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newNames = [...names];
        newNames[index] = event.target.value;
        setNames(newNames);
    };

    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newIds = [...ids];
        newIds[index] = event.target.value;
        setIds(newIds);
    };
    const handleCreateLayout = async () => {
        try {
            // Create group container
            const groupResponse = await axios.post('/api/featuredcategories4xn', {
                name: layoutName,
                layout_type: 'featuredcategories4x2'
            });
            const groupContainer = groupResponse.data;

            // Create categories
            const createdcategories = await axios.post('/api/featuredcategories', {
                ids: ids,
                names: names,
                images: base64Images,
                layout_type: `featuredcategories4x2-${groupContainer[0].id}`
            });

            //await Promise.all(categoryPromises);

            // Refresh data
            const response = await axios.get('/api/featuredcategories4xn/featuredcategories4x2');
            const data: GroupContainer[] = response.data;
            setGroupContainers(data);

            const categoriesPromises = data.map(async (container) => {
                const res = await axios.get(`/api/featuredcategories/${container.layout_type}`);
                return { [container.id]: res.data };
            });

            const categoriesData = await Promise.all(categoriesPromises);
            const categoriesMap = categoriesData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setFeaturedCategories(categoriesMap);

            setShowModal(false);
        } catch (error) {
            console.error('Error creating layout:', error);
        }
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Featured Categories 4x2</h1>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setShowModal(true)}
            >
                Create 4x2 Categories Layout
            </button>
            <table className="min-w-full bg-white">
    <thead>
        <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Images</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
        </tr>
    </thead>
    <tbody>
        {groupContainers.map((container) => (
            <tr key={container.id}>
                <td className="py-2 px-4 border-b text-left">{container.id}</td>
                <td className="py-2 px-4 border-b text-left">{container.name}</td>
                <td className="py-2 px-4 border-b text-left">
                    <div className="flex space-x-2">
                        {featuredCategories[container.id]?.map((category) => (
                            <div key={category.id} className="relative">
                                <img
                                    src={category.url}
                                    alt={category.name}
                                    className="w-32 h-32 object-cover"
                                />
                                <span className="absolute bottom-0 left-0 w-full text-center bg-black bg-opacity-50 text-white text-xs">
                                    {category.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </td>
                <td className="py-2 px-4 border-b text-left">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded">
                        <h2 className="text-xl font-bold mb-4">Create 4x2 Categories Layout</h2>
                        <input 
                            type="text" 
                            placeholder="Layout Name" 
                            className="mb-2 p-2 border w-full" 
                            value={layoutName}
                            onChange={(e) => setLayoutName(e.target.value)} 
                        />
                        <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: RANGE }).map((_, index) => (
                    <div key={index} className="border p-4 flex flex-col items-center">
                        <label htmlFor={`file-input-${index}`} className="relative mb-2 cursor-pointer">
                            <img 
                                src={images[index] || "https://ext.web.wamia.tn:3000/media/placeholder-square.jpg"} 
                                alt="Input Image" 
                                className="mb-2 w-24 h-24" 
                            />
                            <span className="absolute bottom-4 left-0 w-full text-center bg-opacity-50 text-black text-opacity-20">Input Image</span>
                        </label>
                        <input 
                            id={`file-input-${index}`} 
                            type="file" 
                            className="hidden" 
                            onChange={(event) => handleImageChange(event, index)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Name" 
                            className="mb-2 p-2 border" 
                            value={names[index]} 
                            onChange={(event) => handleNameChange(event, index)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Category ID" 
                            className="p-2 border" 
                            value={ids[index]} 
                            onChange={(event) => handleIdChange(event, index)} 
                        />
                    </div>
                ))}
            </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleCreateLayout}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturedCategories4xNPage;