"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product, products as productsApi } from '@/utils/productsApi';
import { renderLayoutAppearance } from './renderLayoutAppearance';
import DatePickerOne from '../FormElements/DatePicker/DatePickerOne';

interface ProductsListModalProps {
    onClose: () => void;
    onRefresh: () => void;
}
const Chip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
    <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 mb-2">
        <span className="truncate max-w-xs">{label}</span>
        <button onClick={onRemove} className="ml-2 text-blue-800">
            x
        </button>
    </div>
);
const ProductsListModal: React.FC<ProductsListModalProps> = ({ onClose, onRefresh }) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [name, setName] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [step, setStep] = useState(1);
    const [selectedLayout, setSelectedLayout] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<{ id: string; name: string }[]>([]);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');

    const toggleRowSelection = (id: string, name: string) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.some((product) => product.id === id)
                ? prevSelectedProducts.filter((product) => product.id !== id)
                : [...prevSelectedProducts, { id, name }]
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
        setSearchTerm(searchTerm);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                label: name,
                productIds: selectedRows.join(','),
                layoutAppearance: selectedLayout,
                start_date: selectedStartDate,
                end_date: selectedEndDate,
            };
            console.log('Payload:', payload);

            const response = await axios.post('/api/carousel', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Product carousel created:', response.data);
            onRefresh();
            onClose();
        } catch (error) {
            console.error('Error creating product carousel:', error);
        }
    };

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-3/4">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Products List</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Carousel Name"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <form onSubmit={handleSearchSubmit} className="mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="⌕     Search products..."
                                className="border p-2 rounded w-full"
                            />
                        </form>
                        <div className="flex flex-wrap mb-4">
                            {selectedProducts.map((product) => (
                                <Chip
                                    key={product.id}
                                    label={product.name}
                                    onRemove={() => toggleRowSelection(product.id, product.name)}
                                />
                            ))}
                        </div>
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
                                            className={`cursor-pointer ${selectedRows.includes(product.id + '') ? 'bg-blue-100' : ''}`}
                                            onClick={() => toggleRowSelection(product.id + '', product.name)}
                                        >
                                            <td className="py-2 px-4 border-b text-left">{product.id}</td>
                                            <td className="py-2 px-4 border-b text-left">{product.sku}</td>
                                            <td className="py-2 px-4 border-b text-left">{product.name}</td>
                                            <td className="py-2 px-4 border-b text-left">
                                                <img
                                                    src={"http://localhost/media/catalog/product" + product.media_gallery_entries[0]?.file}
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
                                onClick={handleNextStep}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Choose Layout Appearance</h2>
                        <div className="flex justify-around mb-4">
                            <div
                                className={`cursor-pointer p-4 border ${selectedLayout === 'layout1' ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setSelectedLayout('layout1')}
                            >
                                <p>Layout 1</p>
                                {renderLayoutAppearance('layout1', false)}
                            </div>
                            <div
                                className={`cursor-pointer p-4 border ${selectedLayout === 'layout2' ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setSelectedLayout('layout2')}
                            >
                                <p>Layout 2</p>
                                {renderLayoutAppearance('layout2', false)}
                            </div>
                            <div
                                className={`cursor-pointer p-4 border ${selectedLayout === 'layout3' ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setSelectedLayout('layout3')}
                            >
                                <p>Layout 3</p>
                                {renderLayoutAppearance('layout3', false)}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-500 text-white px-2 py-1 rounded"
                                onClick={handlePreviousStep}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={handleNextStep}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
                {step === 3 && (  
                    <>
                        <h2 className="text-xl font-bold mb-4">Optional: Choose time</h2>
                        <h3 className='pt-4'>Start date</h3>
                        <DatePickerOne date={selectedStartDate} setDate={setSelectedStartDate} className="start-datepicker"/>
                        <h3 className='pt-4'>End date</h3>
                        <DatePickerOne date={selectedEndDate} setDate={setSelectedEndDate} className="end-datepicker"/>

                        
                    <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-500 text-white px-2 py-1 rounded"
                                onClick={handlePreviousStep}
                            >
                                Back
                            </button>
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                    )}
            </div>
        </div>
    );
};

export default ProductsListModal;