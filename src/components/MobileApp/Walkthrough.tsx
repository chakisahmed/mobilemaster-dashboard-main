"use client";
import React, { useEffect, useState } from 'react';
import { deleteWalkthroughData, getWalkthroughData, postWalkthroughData, WalkthroughType } from '@/utils/walkthroughApi';
import { convertToBase64 } from '@/utils/file_utils';
import axios from 'axios';

const Walkthrough: React.FC = () => {
    const [walkthroughItems, setWalkthroughItems] = useState<WalkthroughType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [checkedWalkthroughItems, setCheckedWalkthroughItems] = useState<WalkthroughType[]>([]);
    const [newWalkthrough, setNewWalkthrough] = useState<Partial<WalkthroughType>>({
        title: '',
        description: '',
        image: '',
        sort_order: ''
    });
    const [selectedWalkthrough, setSelectedWalkthrough] = useState<WalkthroughType | null>(null);

    const handleRowClick = (item: WalkthroughType) => {
        setSelectedWalkthrough(item);
        setIsModalOpen(true);
    };

    const fetchWalkthroughItems = async () => {
        try {
            const data = await getWalkthroughData();
            setWalkthroughItems(data);
        } catch (error: any) {
            console.error('Error fetching walkthrough items:', error);
        }
    };

    useEffect(() => {
        fetchWalkthroughItems();
    }, []);

    const handleCreateClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedWalkthrough(null);
    };

    const handleSubmit = async () => {
        try {
            const response = await postWalkthroughData(newWalkthrough as WalkthroughType);
            setWalkthroughItems([...walkthroughItems, response]);
            handleCloseModal();
        } catch (error: any) {
            console.error('Error creating walkthrough item:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">

                <button
                    className="bg-primary text-white px-4 py-2 rounded-md" onClick={handleCreateClick}
                >
                    Create
                </button>
                {checkedWalkthroughItems.length > 0 && (
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={async () => {
                            try {
                                checkedWalkthroughItems.forEach(async (item) => {
                                    const response = await deleteWalkthroughData(item.id);
                                });

                                setWalkthroughItems(walkthroughItems.filter((item) => !checkedWalkthroughItems.includes(item)));
                                setCheckedWalkthroughItems([]);
                            } catch (error: any) {
                                console.error('Error deleting walkthrough items:', error);
                            }
                        }}
                    >
                        Delete
                    </button>
                )

                }
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">ID</th>
                        <th className="py-2 px-4 border-b text-left"></th>
                        <th className="py-2 px-4 border-b text-left">Title</th>
                        <th className="py-2 px-4 border-b text-left">Description</th>
                        <th className="py-2 px-4 border-b text-left">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {walkthroughItems.map((item) => (
                        <tr key={item.id} onClick={() => handleRowClick(item)}>
                            <td className="py-2 px-4 border-b text-left">
                                <input type="checkbox" key={item.id} onClick={e => e.stopPropagation()}
                                    onChange={e => {
                                        if (e.target.checked) {
                                            setCheckedWalkthroughItems([...checkedWalkthroughItems, item]);
                                        } else {
                                            setCheckedWalkthroughItems(
                                                checkedWalkthroughItems.filter(i => i.id !== item.id)
                                            );
                                        }
                                    }} />
                            </td>
                            <td className="py-2 px-4 border-b text-left">{item.id}</td>
                            <td className="py-2 px-4 border-b text-left">{item.title}</td>
                            <td className="py-2 px-4 border-b text-left">{item.description}</td>
                            <td className="py-2 px-4 border-b text-left">
                                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && selectedWalkthrough && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">{selectedWalkthrough.title}</h2>
                        <p>{selectedWalkthrough.description}</p>
                        <img src={selectedWalkthrough.image} alt={selectedWalkthrough.title} className="w-1/2 h-auto object-cover mb-4" />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-500 text-white px-2 py-1 rounded"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && !selectedWalkthrough && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Create Walkthrough Item</h2>
                        <input
                            type="text"
                            value={newWalkthrough.title}
                            onChange={(e) => setNewWalkthrough({ ...newWalkthrough, title: e.target.value })}
                            placeholder="Title"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <textarea
                            value={newWalkthrough.description}
                            onChange={(e) => setNewWalkthrough({ ...newWalkthrough, description: e.target.value })}
                            placeholder="Description"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <div>

                            <input
                                type="file"
                                className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                                placeholder="Upload Image"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        convertToBase64(e.target.files[0]).then((base64) => {
                                            setNewWalkthrough({ ...newWalkthrough, image: base64 });
                                        });
                                    }
                                }
                                }
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-gray-500 text-white px-2 py-1 rounded"
                                onClick={handleCloseModal}
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
            )}
        </div>
    );
};

export default Walkthrough;