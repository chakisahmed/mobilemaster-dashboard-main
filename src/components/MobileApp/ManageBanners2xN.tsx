"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertToBase64 } from '@/utils/file_utils';

const Manage2x1Banners = ({ bannerGroup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [selectedBanners, setSelectedBanners] = useState([]);
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
        const response = await axios.get('/api/banners2xn/create/banner2x1');
        const bannerContainers = response.data;

        const bannersWithItems = await Promise.all(
          bannerContainers.map(async (banner) => {
            const items = await fetchBannerItems(banner.layout_type + '-' + banner.id);
            return { ...banner, items };
          })
        );

        setBanners(bannersWithItems);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, []);

  const fetchBannerItems = async (layoutType) => {
    try {
      const response = await axios.get(`/api/banners2xn/banner/${layoutType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching banners for layout type ${layoutType}:`, error);
      return [];
    }
  };

  const handleEditBanner = (banner) => {
    setBannerToEdit(banner);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id) => {
    setSelectedBanners((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((bannerId) => bannerId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb">
          <ul className="flex space-x-2 text-gray-600">
            <li className="flex items-center">
              <a href="/manage-2x1-banners" className="hover:underline">Manage 2x1 Banners</a>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="flex items-center">
              <a href="/manage-2x2-banners" className="hover:underline">Manage 2x2 Banners</a>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500">Manage Banners</span>
            </li>
          </ul>
        </nav>

        <h1 className="text-4xl font-bold text-center mb-8">Manage 2x1 Banners</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
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
                      {banner.items.map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover"
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

const CreateBannerModal = ({ setIsModalOpen, setBanners, bannerToEdit }) => {
  const [name, setName] = useState(bannerToEdit ? bannerToEdit.name : '');
  const [images, setImages] = useState(bannerToEdit ? bannerToEdit.items.map(item => ({
    image: item.image,
    banner_type: item.banner_type || 'category',
    catalog_id: item.catalog_id || '',
    name: item.name || ''
  })) : [{ image: null, banner_type: 'category', catalog_id: '', name: '' }, { image: null, banner_type: 'category', catalog_id: '', name: '' }]);

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index].image = file;
    setImages(newImages);
  };

  const handleBannerTypeChange = (index, value) => {
    const newImages = [...images];
    newImages[index].banner_type = value;
    setImages(newImages);
  };

  const handleCatalogIdChange = (index, value) => {
    const newImages = [...images];
    newImages[index].catalog_id = value;
    setImages(newImages);
  };

  const handleNameChange = (index, value) => {
    const newImages = [...images];
    newImages[index].name = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (bannerToEdit) {
        response = await axios.put(`/api/banners2xn/create/${bannerToEdit.id}`, { name: name, layout_type: 'banner2x1' });
      } else {
        response = await axios.post('/api/banners2xn/create', { name: name, order: -1, layout_type: 'banner2x1' });
      }
      const bannerGroup = response.data;
      let i = 1;
      for (const image of images) {
        if (image.image) {
          const formData = new FormData();
          formData.append('name', image.name);
          formData.append('banner_type', image.banner_type);
          formData.append('catalog_id', image.catalog_id);
          formData.append('order', i);
          formData.append('status', '1');
          formData.append('layout_type', 'banner2x1-' + bannerGroup.id);
  
          const base64String = await convertToBase64(image.image);
          console.log('Base64 image:', base64String.substring(0, 100));
          formData.append('image', base64String);
          console.log(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
  
          if (bannerToEdit) {
            // Update existing image
            await axios.put(`/api/banners/${bannerToEdit.items[i - 1].id}`, formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } else {
            // Create new image
            await axios.post('/api/banners/create', formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
  
          i++;
        }
      }
      setBanners((prevBanners) => [
        ...prevBanners,
        { id: bannerGroup.id, name, status: '1' },
      ]);

      setIsModalOpen(false);
    } catch (error) {
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
            {images.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
              {image.image && (
                <img
                src={typeof image.image === 'string' ? image.image : URL.createObjectURL(image.image)}
                alt="Preview"
                className="mb-2"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              )}
              <input
                type="file"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                required
                className="border p-2 w-full"
              />
              <select
                value={image.banner_type}
                onChange={(e) => handleBannerTypeChange(index, e.target.value)}
                className="border p-2 mt-2 w-full"
              >
                <option value="product">Product</option>
                <option value="category">Category</option>
              </select>
              <input
                type="text"
                value={image.catalog_id}
                onChange={(e) => handleCatalogIdChange(index, e.target.value)}
                placeholder="Catalog ID"
                className="border p-2 mt-2 w-full"
              />
              <input
                type="text"
                value={image.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Name"
                className="border p-2 mt-2 w-full"
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

export default Manage2x1Banners;