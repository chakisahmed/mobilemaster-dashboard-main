"use client";
import React, { use, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { renderLayoutAppearance } from './renderLayoutAppearance';
import { getTagsData, TagsType } from '@/utils/tagsApi';
const ITEM_TYPE = 'ITEM';
const AppCreator = () => {
    //const [banner2x1, setBanner2x1] = useState([]);
    const [banner2x2, setBanner2x2] = useState([]);
    const [featuredCategories4x1, setFeaturedCategories4x1] = useState([]);
    const [featuredCategories4x2, setFeaturedCategories4x2] = useState([]);
    const [homepagedata, setHomepagedata] = useState([]);
    const [tags, setTags] = useState<TagsType[]>([]);
    //carousel
    interface CarouselItem {
        id: string;
        label: string;
        layout_appearance: string;
    }

    const [carousel, setCarousel] = useState<CarouselItem[]>([]);




    interface MiddleListItem {
        id: string;
        layout_id?: string;
        label: string;
        type: string;
        layoutAppearance?: string;
    }

    const [middleList, setMiddleList] = useState<MiddleListItem[]>([]);
    const [appPreview, setAppPreview] = useState([]);
    const moveItem = useCallback(async (dragIndex: number, hoverIndex: number) => {
        const updatedList = [...middleList];
        const [draggedItem] = updatedList.splice(dragIndex, 1);
        updatedList.splice(hoverIndex, 0, draggedItem);
        setMiddleList(updatedList);
        try {
            const payload = {
                id1: middleList[dragIndex].id,
                id2: middleList[hoverIndex].id,
                pos1: dragIndex + 1,
                pos2: hoverIndex + 1
            };
            console.log('Payload:', payload);
            let response = await axios.put('/api/sort_order/swap', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error:any) {
            console.error('Error swapping sort order positions:', error);
        }
    },[middleList]);
    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                const response = await axios.get('/api/homepagedata');
                setHomepagedata(response.data);

            } catch (error:any) {
                console.error('Error fetching homepage data:', error);
            }
        }
        fetchHomepageData();

    }, []);
    const fetchData = async () => {
        try {
            //const banner2x1Response = await axios.get('/api/banners2xn/create/banner2x1');
            const banner2x2Response = await axios.get('/api/banners2xn/create/banner2x2');
            const featuredCategories4x1Response = await axios.get('/api/featuredcategories4xn/featuredcategories4x1');
            const featuredCategories4x2Response = await axios.get('/api/featuredcategories4xn/featuredcategories4x2');
            const carouselResponse = await axios.get('/api/carousel');
            const tagsResponse = await getTagsData();
            setTags(tagsResponse);
            //setBanner2x1(banner2x1Response.data);
            setBanner2x2(banner2x2Response.data);
            setFeaturedCategories4x1(featuredCategories4x1Response.data);
            setFeaturedCategories4x2(featuredCategories4x2Response.data);
            setCarousel(carouselResponse.data);

            // Fetch sort order data for the middle list container
            const sortOrderResponse = await axios.get('/api/sort_order');
            setMiddleList(sortOrderResponse.data);
            setAppPreview(sortOrderResponse.data);
        } catch (error:any) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        document.title = "Homepage Configurator";


        fetchData();
    }, []);

    const addToMiddleList = async (item: { layout_id: any; label: any; position?: number; type: any; layout_type?: any; id?: any; name?: any; layoutAppearance?: any; }) => {
        try {
            const payload = {
                layout_id: item.layout_id ?? item.layout_type + '-' + item.id,
                label: item.label ?? item.name,
                position: middleList.length + 1, // Get the next position in the list
                type: item.type,
                layout_appearance: item.layoutAppearance ?? null
            };
            console.log('Payload:', payload);
            const response = await axios.post('/api/sort_order', payload);
            
            console.log("add to middlelist",{ label: item.label ?? item.name, type: item.type, layout_appearance: item.layoutAppearance ?? null })
            setMiddleList([]);
            fetchData();
        } catch (error:any) {
            console.error('Error posting sort order data:', error);
        }
    };

    const removeFromMiddleList = (index: number) => {
        // call /api/sort_order/[id] DELETE request
        const deleteItem = async (id: string) => {
            try {
                const response = await axios.delete(`/api/sort_order/${id}`);
                console.log('Response:', response.data);
            } catch (error:any) {
                console.error('Error deleting sort order item:', error);
            }
        };
        deleteItem(middleList[index].id);
        setMiddleList(middleList.filter((_, i) => i !== index));
    };  

    function renderAppPreview(): React.ReactNode {
      
        return (
            appPreview.map((item:any, index) => {

                if (item.type === 'banner') {
                    if (item.layout_id == "bannerimages")
                        return (
                            <div key={index} className="mb-5">
                                <h2 className="text-xl font-bold mb-2">{item.label}</h2>
                                <div className={`h-48 bg-gray-300 rounded-lg relative overflow-hidden`}>
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            </div>
                        );
                    else return (
                        <div key={index} className="mb-5">
                            <h2 className="text-xl font-bold mb-2">{item.label}</h2>
                            <div className={`h-30 flex flex-row space-x-4`}>
                                <div className="w-1/2 bg-gray-300 rounded-lg relative overflow-hidden">
                                <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-1/2 bg-gray-300 rounded-lg relative overflow-hidden">
                                <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    );
                }
                else if (item.type === 'category') {
                    if(item.layout_id=="featuredcategories")
                    return (
                        <div key={index} className="mb-5">
                            <h2 className="text-xl font-bold mb-2">{item.label}</h2>
                            <div className="flex justify-between">
                                <div className="w-16 h-16 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-16 h-16 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                    );
                    else return(
                        <div key={index} className="mb-5">
                            <h2 className="text-xl font-bold mb-2">{item.label}</h2>
                            <div className="flex justify-between space-x-4">
                                <div className="w-32 h-8 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-32 h-8 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                <div className="w-32 h-8 bg-gray-300 rounded-full relative overflow-hidden">
                                    <svg className="absolute inset-0 w-full h-full text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                                

                            </div>
                        </div>
                    )
                } else if (item.type === 'product') {
                    console.log('item id', item.layout_id);
                    console.log('Carousel:', carousel);
                    const layout_id = item.layout_id?.split('-')[1];
                    const layout_appearance = carousel.find((carouselItem:any) => carouselItem.id === layout_id)?.layout_appearance;
                    console.log('Layout Appearance:', layout_appearance);
                    return (
                        renderLayoutAppearance(layout_appearance || '', false)
                        // <div key={index} className="mb-5">
                        //     <h2 className="text-xl font-bold mb-2">{item.label}</h2>
                        //     <div className="flex justify-between ">
                        //         <div className="w-32 h-48 bg-gray-300 rounded-md relative overflow-hidden flex items-center justify-center">
                        //             <svg className="w-16 h-16 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        //                 <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        //             </svg>
                        //         </div>
                        //         <div className="w-32 h-48 bg-gray-300 rounded-md relative overflow-hidden flex items-center justify-center">
                        //             <svg className="w-16 h-16 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        //                 <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        //             </svg>
                        //         </div>
                        //         <div className="w-32 h-48 bg-gray-300 rounded-md relative overflow-hidden flex items-center justify-center">
                        //             <svg className="w-16 h-16 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        //                 <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        //             </svg>
                        //         </div>


                        //     </div>
                        // </div>
                    );
                }
            })
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 p-8">
            {/* Lists Container */}
            <div className="w-1/4 p-4 mr-4 bg-white rounded-lg shadow-lg overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Banner Images</h2>
                <ul className="mb-8">

                    <li className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({ layout_id: 'bannerimages', label: "Banner Images", position: middleList.length + 1, type: "banner" })}>
                        Click to add Banner
                    </li>

                </ul>
                <h2 className="text-xl font-bold mb-4" >Featured Categories</h2>
                <ul className="mb-8">

                    <li className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({ layout_id: 'featuredcategories', label: "Featured Categories", position: middleList.length + 1, type: "category" })}>
                        Featured Categories
                    </li>
                    <li className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({ layout_id: 'maincategories', label: "Main Categories", position: middleList.length + 1, type: "category" })}>
                        Main Categories
                    </li>

                </ul>


                <h2 className="text-xl font-bold mb-4">Secondary Banners</h2>
                <ul>
                    {banner2x2.map((item:any, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({ ...item, type: 'banner' })}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                
                <h2 className="text-xl font-bold mb-4">Carousel</h2>
                <ul>
                    {carousel.map((item:any, index) => (
                        <li key={index} className="mb-2 p-2 bg-gray-200 rounded-lg cursor-pointer" onClick={() => addToMiddleList({ layout_id: 'product-' + item.id, label: item.label, position: middleList.length + 1, type: "product" })}>
                            {item.label}
                        </li>
                    ))}
                </ul>


            </div>

            {/* Middle List Container */}
            <DndProvider backend={HTML5Backend}>
                <div className="w-1/4 p-4 mr-4 bg-white rounded-lg shadow-lg overflow-y-auto">
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
            <div className="w-2/5 h-auto border-1 pb-8 border-black rounded-3xl shadow-lg bg-black flex flex-col items-center relative">
                <h1 className="text-white text-2xl font-bold mt-4">Homepage preview</h1>
                <div className="bg-black text-white p-4 rounded-t-2xl w-full text-center">
                    {/* Header with w-16 h-2 grey div with rounded border */}
                    <div className="flex justify-center">
                        <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
                {/* Screen Container */}
                
                <div className="w-11/12 h-full bg-white rounded-2xl overflow-y-scroll p-4">
                <Image src={"/images/navbar.jpeg"} alt="Preview" layout="responsive" width={120} height={50} />
                {
                    <div className="flex justify-around mt-4">
                        {tags.map((tag, index) => (
                            <span key={index} className="pb-2 text-sm font-semibold text-black">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                }
                    {renderAppPreview()}
                    {/* Scrollable Content */}
                    {/* <div className="flex flex-col mt-4">
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
                    </div> */}
                </div>
            </div>
        </div>
    );
};
interface DraggableListItemProps {
    id: string;
    index: number;
    label: string;
    moveItem: (dragIndex: number, hoverIndex: number) => Promise<void>;
    removeFromMiddleList: () => void;
}

const DraggableListItem: React.FC<DraggableListItemProps> = React.memo(({ id, index, label, moveItem, removeFromMiddleList }) => {
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
});

DraggableListItem.displayName = "DraggableListItem";

export default AppCreator;