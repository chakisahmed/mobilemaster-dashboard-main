"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { renderLayoutAppearance } from './renderLayoutAppearance';
import ProductsListModal from './ProductsListModal';

const Carousel: React.FC = () => {
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const fetchCarouselItems = async () => {
        try {
            const response = await axios.get('/api/carousel');
            setCarouselItems(response.data);
        } catch (error) {
            console.error('Error fetching carousel items:', error);
        }
    };

    useEffect(() => {
        fetchCarouselItems();
    }, []);

    const handleCreateClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button
                    className="bg-primary text-white px-4 py-2 rounded-md" onClick={handleCreateClick}
                >
                    Create
                </button>
                {checkedItems.length > 0 && <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        try {
                            checkedItems.forEach(async (id) => {
                                await axios.delete(`/api/carousel/${id}`);
                            });
                            setCarouselItems((prevCarouselItems) =>
                                prevCarouselItems.filter((item) => !checkedItems.includes(item.id))
                            );
                            setCheckedItems([]);
                        } catch (error) {
                            console.error('Error deleting carousel items:', error);
                        }
                    }}
                >
                    Delete
                </button>}
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left"></th>
                        <th className="py-2 px-4 border-b text-left">ID</th>
                        <th className="py-2 px-4 border-b text-left">Label</th>
                        <th className="py-2 px-4 border-b text-left">Products</th>
                        <th className="py-2 px-4 border-b text-left">Layout Type</th>
                        <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {carouselItems.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b text-left">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    value={item.id}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCheckedItems((prevCheckedItems) => [...prevCheckedItems, item.id]);
                                        } else {
                                            setCheckedItems((prevCheckedItems) =>
                                                prevCheckedItems.filter((checkedItem) => checkedItem !== item.id)
                                            );
                                        }
                                    }}
                                />
                            </td>
                            <td className="py-2 px-4 border-b text-left">{item.id}</td>
                            <td className="py-2 px-4 border-b text-left">{item.label}</td>
                            <td className="py-2 px-4 border-b text-left">
                                <ul>
                                    {item.products.map((product, index) => (
                                        <li key={index}>{product.name}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border-b text-left">
                                {renderLayoutAppearance(item.layout_appearance, true)}
                            </td>
                            <td className="py-2 px-4 border-b text-left">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleEditClick(item.id)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && <ProductsListModal onClose={handleCloseModal} onRefresh={fetchCarouselItems} />}
        </div>
    );
};

export default Carousel;