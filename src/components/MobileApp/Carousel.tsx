"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product, products as productsApi} from '@/utils/productsApi';



interface CarouselItem {
    id: string;
    label: string;
    products: Product[];
}


interface ProductsListModalProps {
    onClose: () => void;
    onRefresh: () => void;
}

const ProductsListModal: React.FC<ProductsListModalProps> = ({ onClose, onRefresh }) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [name, setName] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsApi(searchTerm, undefined);
                setProducts(response.items);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Fetch products with the current search term
        setSearchTerm(searchTerm);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                label:name,
                productIds: selectedRows.join(','),
            };

            const response = await axios.post('/api/carousel', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Product carousel created:', response.data);
            onRefresh(); // Refresh carousel items after successful submission
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error creating product carousel:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-3/4">
                <h2 className="text-xl font-bold mb-4">Products List</h2>
                <form onSubmit={handleSearchSubmit} className="mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="border p-2 rounded w-full"
                    />
                </form>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Carousel Name"
                    className="border p-2 rounded w-full mb-4"
                />
                <div className="overflow-y-auto max-h-96">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Id</th>
                                <th className="py-2 px-4 border-b text-left">SKU</th>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={`cursor-pointer ${selectedRows.includes(product.id+'') ? 'bg-blue-100' : ''}`}
                                    onClick={() => toggleRowSelection(product.id+'')}
                                >
                                    <td className="py-2 px-4 border-b text-left">{product.id}</td>
                                    <td className="py-2 px-4 border-b text-left">{product.sku}</td>
                                    <td className="py-2 px-4 border-b text-left">{product.name}</td>
                                    <td className="py-2 px-4 border-b text-left">
                                        <img
                                            src={"http://localhost/media/catalog/product" + product.id}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleCreateClick}
                >
                    Create
                </button>
                {checkedItems.length>0   &&<button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        try {
                            checkedItems.forEach(async (id) => {
                                await axios.delete(`/api/carousel/${id}`);

                            }
                            );
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