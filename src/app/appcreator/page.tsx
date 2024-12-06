"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const ITEM_TYPE = 'ITEM';
const AppCreatorPage = () => {
    const [banner2x1, setBanner2x1] = useState([]);
    const [banner2x2, setBanner2x2] = useState([]);
    const [featuredCategories4x1, setFeaturedCategories4x1] = useState([]);
    const [featuredCategories4x2, setFeaturedCategories4x2] = useState([]);
    //carousel
    const [carousel, setCarousel] = useState([]);

    
    
    const [middleList, setMiddleList] = useState([]);
    const moveItem = async (dragIndex: number, hoverIndex: number) => {
        const updatedList = [...middleList];
        const [draggedItem] = updatedList.splice(dragIndex, 1);
        updatedList.splice(hoverIndex, 0, draggedItem);
        setMiddleList(updatedList);
        try {
            const payload = {
                id1: middleList[dragIndex].id,
                id2: middleList[hoverIndex].id,
                pos1: dragIndex+1,
                pos2: hoverIndex+1
            };
            console.log('Payload:', payload);
            let response = await axios.put('/api/sort_order/swap', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error swapping sort order positions:', error);
        }
      };
    useEffect(() => {
        document.title = "Homepage Configurator";

        const fetchData = async () => {
            try {
                const banner2x1Response = await axios.get('/api/banners2xn/create/banner2x1');
                const banner2x2Response = await axios.get('/api/banners2xn/create/banner2x2');
                const featuredCategories4x1Response = await axios.get('/api/featuredcategories4xn/featuredcategories4x1');
                const featuredCategories4x2Response = await axios.get('/api/featuredcategories4xn/featuredcategories4x2');
                const carouselResponse = await axios.get('/api/carousel');
                setBanner2x1(banner2x1Response.data);
                setBanner2x2(banner2x2Response.data);
                setFeaturedCategories4x1(featuredCategories4x1Response.data);
                console.log(featuredCategories4x1Response.data);
                setFeaturedCategories4x2(featuredCategories4x2Response.data);
                console.log(featuredCategories4x2Response.data);
                setCarousel(carouselResponse.data);

                // Fetch sort order data for the middle list container
                const sortOrderResponse = await axios.get('/api/sort_order');
                setMiddleList(sortOrderResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const addToMiddleList = async (item) => {
        try {
            const payload= {
                layout_id: item.layout_id ?? item.layout_type + '-' + item.id,
                label: item.label ?? item.name,
                position: middleList.length + 1, // Get the next position in the list
                type: item.type
            };
            console.log('Payload:', payload);
            const response = await axios.post('/api/sort_order', payload);
            setMiddleList([...middleList, response.data]);
        } catch (error) {
            console.error('Error posting sort order data:', error);
        }
    };

    const removeFromMiddleList = (index) => {
        // call /api/sort_order/[id] DELETE request
        const deleteItem = async (id) => {
            try {
                const response = await axios.delete(`/api/sort_order/${id}`);
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error deleting sort order item:', error);
            }
        };
        deleteItem(middleList[index].id);
        setMiddleList(middleList.filter((_, i) => i !== index));
    };

    return (
        <div className="flex justify-between h-screen bg-gray-100 p-8">
            {/* Lists Container */}
            <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-4" onClick={() => addToMiddleList({layout_id:'bannerimages', label:"Banner Images",position:middleList.length+1, type:"banner"})}>Banner Images</h2>
            <h2 className="text-xl font-bold mb-4" onClick={() => addToMiddleList({layout_id:'featuredcategories', label:"Featured Categories",position:middleList.length+1, type:"category"})}>Featured Categories</h2>


                <h2 className="text-xl font-bold mb-4">Banner 2x1 Items</h2>
                <ul className="mb-8">
                    {banner2x1.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList(item,'banner')}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-xl font-bold mb-4">Banner 2x2 Items</h2>
                <ul>
                    {banner2x2.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({...item,type:'banner'})}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-xl font-bold mb-4">Featured Categories 4x1 Items</h2>
                <ul>
                    {featuredCategories4x1.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({...item,type:'category'})}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-xl font-bold mb-4">Featured Categories 4x2 Items</h2>
                <ul>
                    {featuredCategories4x2.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({...item,type:'category'})}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                <h2 className="text-xl font-bold mb-4">Carousel</h2>
                <ul>
                    {carousel.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({layout_id:'product-'+item.id, label:item.label,position:middleList.length+1, type:"product"},'product')}>
                            {item.label}
                        </li>
                    ))}
                </ul>


            </div>

            {/* Middle List Container */}
    <DndProvider backend={HTML5Backend}>
      <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Selected Items</h2>
        <ul>
          {middleList.map((item, index) => (
            <DraggableListItem
              key={item.id}
              index={index}
              id={item.id}
              label={item.label}
              moveItem={moveItem}
              removeFromMiddleList={() => removeFromMiddleList(index)}
            />
          ))}
        </ul>
      </div>
    </DndProvider>

            {/* Phone Container */}
            <div className="w-80 h-160 border-8 border-black rounded-3xl shadow-lg bg-black flex flex-col justify-center items-center relative">
                <div className="bg-black text-white p-4 rounded-t-2xl w-full text-center">
                    {/* Header with w-16 h-2 grey div with rounded border */}
                    <div className="flex justify-center">
                        <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
                {/* Screen Container */}
                <div className="w-72 h-150 bg-white rounded-2xl overflow-y-scroll p-4">
                    {/* Scrollable Content */}
                    <div className="flex flex-col mt-4">
                        {/* Example content for the scrollable area */}
                        <div className="mb-5">
                            <h2 className="text-xl font-bold mb-2">Banner Images</h2>
                            <div className="h-24 bg-gray-300 rounded-lg"></div>
                        </div>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold mb-2">Featured Categories</h2>
                            <div className="flex justify-between">
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold mb-2">New Products</h2>
                            <div className="h-32 bg-gray-300 rounded-lg"></div>
                        </div>
                        <div className="mb-5">
                            <h2 className="text-xl font-bold mb-2">Hot Deals</h2>
                            <div className="h-32 bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const DraggableListItem = ({ id, index, label, moveItem, removeFromMiddleList }) => {
    const ref = React.useRef(null);
  
    const [, drop] = useDrop({
      accept: ITEM_TYPE,
      hover(item: { index: number }) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
  
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
  
        // Move the item in the list
        moveItem(dragIndex, hoverIndex);
  
        // Update the index for the dragged item
        item.index = hoverIndex;
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: ITEM_TYPE,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));
  
    return (
      <li
        ref={ref}
        className="mb-2 p-2 bg-gray-200 rounded-lg flex justify-between items-center"
        style={{ opacity }}
      >
        {label}
        <button className="text-red-500 ml-4" onClick={removeFromMiddleList}>
          x
        </button>
      </li>
    );
  };
  
export default AppCreatorPage;