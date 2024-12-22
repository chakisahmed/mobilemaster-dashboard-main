"use client";
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Select from 'react-select';

import axios from 'axios';
import DraggableRow from '../DraggableRow';
import AddBannerModal from '../AddBannerModal';
import { products,Product } from '@/utils/productsApi';

interface BannerType {
  id: string;
  name: string;
  image: string;
  banner_type: string;
  catalog_id: string;
  order: string;
  status: string;
}


export default function ManageBanners() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [checkedBanners, setCheckedBanners] = useState<Set<string>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/banners/create');
        setBanners(response.data);
      } catch (error:any) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);
  
  const handleEdit = (banner: BannerType) => {
    setSelectedBanner(banner);
    setEditMode(true);
    setIsModalOpen(true);
  };
  const onBannerAdded = (banner: BannerType) => {
    if (editMode) {
      // Update the existing banner in the list
      setBanners(banners.map(b => (b.id === banner.id ? banner : b)));
    } else {
      // Add the new banner to the list
      setBanners([...banners, banner]);
    }
    setEditMode(false); // Reset edit mode
  };
  const moveRow = async (fromIndex: number, toIndex: number) => {
    const updatedBanners = [...banners];
    const [movedRow] = updatedBanners.splice(fromIndex, 1);
    updatedBanners.splice(toIndex, 0, movedRow);

    // Update the order of the banners
    const updatedOrder = updatedBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
    }));


    try {
      await Promise.all(
        updatedOrder.map(banner =>
          axios.put(`/api/banners/create/${banner.id}`, { order: banner.order })
        )
      );
      setBanners(updatedOrder);
    } catch (error:any) {
      console.error('Error updating banner order:', error);
    }
  };
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setCheckedBanners((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(checkedBanners);
    try {
      await Promise.all(idsToDelete.map(id => axios.delete(`/api/banners/create/${id}`)));
      setBanners(prevBanners => prevBanners.filter(banner => !checkedBanners.has(banner.id)));
      setCheckedBanners(new Set());
    } catch (error:any) {
      console.error('Error deleting banners:', error);
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className=" bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb">
          <ul className="flex space-x-2 text-gray-600">
            <li className="flex items-center hover:underline" >
              <span className="text-gray-500"><a >Manage Banners </a></span>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="flex items-center">
              <a href="/secondary-banners">Manage Secondary Banners</a>
            </li>
            {/* <li className="flex items-center">
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
              <a href="/advertisements">Manage Advertisements</a>
            </li> */}
          </ul>
        </nav>

          <h1 className="text-4xl font-bold text-center mb-8">Manage Banners</h1>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedBanner(null);
                setEditMode(false);
                setIsModalOpen(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-md"            >
              Add Banner
            </button>
            {checkedBanners.size > 0 && (
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete the selected banners?')) {
                    handleDelete();
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>

          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap" />

                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Banner Type</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Catalog ID</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner, index) => (
                <DraggableRow
                  key={banner.id}
                  index={index}
                  banner={banner}
                  moveRow={moveRow}
                  onEdit={handleEdit}
                  onCheckboxChange={handleCheckboxChange}
                  isChecked={checkedBanners.has(banner.id)}
                />
              ))}
            </tbody>
          </table>

          {/* Add Banner Modal */}
          <AddBannerModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onBannerAdded={onBannerAdded}
            banner={selectedBanner}
            editMode={editMode}
          />
        </div>
      </div>
    </DndProvider>
  );

}
