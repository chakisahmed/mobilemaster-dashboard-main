"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductMedia from './ProductMedia';
import { Product, productBySku } from '@/utils/productsApi';
import DatePickerOne from '../FormElements/DatePicker/DatePickerOne';
import RichTextEditor from '../WYSIWYG/RichTextEditor';
import axios from 'axios';
import BarcodeComponent from '../BarcodeComponent';

const ProductDetails = () => {
    const searchParams = useSearchParams();
    const [sku, setSku] = useState<string | undefined>(undefined);
    const [product, setProduct] = useState<Product>();
    const [currency, setCurrency] = useState<string>('');

    useEffect(() => {
        const fetchProduct = async (sku: string) => {
            const res = await productBySku(sku);
            setProduct(res);
            console.log(res.name);
        }; 
        const sku = searchParams.get('sku');
        if (sku) {
            setSku(sku);
            fetchProduct(sku);
        }
    }, [searchParams]);
    useEffect(() => {
        const fetchCurrency = async () => {
            const res = await axios.get('/api/isLogged');
            
            setCurrency(res.data.base_currency_symbol);
        };
        fetchCurrency();
    }
    , []);

    return (
        <div className="grid grid-cols-2 gap-5 p-5 border border-gray-300 rounded-lg bg-gray-100">
          <div className="col-span-2 p-5 border border-gray-300 rounded-lg bg-white">
            <h1 className="font-medium text-xl text-black">General Information</h1>
            <div className="mb-2">
              <label className="font-medium">Product Name</label>
              <input type="text" className="w-full p-2 mt-1 rounded-lg border border-gray-300" value={product?.name}/>
            </div>
            <div className="mb-2">
                <RichTextEditor initialValue={product?.custom_attributes.find((att) => att.attribute_code=="description")?.value} height={200}/>
              </div>
          </div>
    
          <ProductMedia images={product?.media_gallery_entries.map((media) => media.file) || []}/>
    
          <div className="p-5 border border-gray-300 rounded-lg bg-white">
            <h2 className="font-medium text-xl text-black">Pricing</h2>
            <div className="mb-2">
              <label className="font-medium">Base Price</label>
              <input type="text" className="w-full p-2 mt-1 rounded-lg border border-gray-300" value={product?.price}/>
            </div>
            <div className="mb-2">
              <label className="font-medium">Special Price</label>
              <input type="text" className="w-full p-2 mt-1 rounded-lg border border-gray-300" value={product?.custom_attributes.find((att) => att.attribute_code=="special_price")?.value}/>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">From</label>
                <DatePickerOne date={product?.custom_attributes.find((att) => att.attribute_code=="special_from_date")?.value ?? ''}/>
              </div>
              <div>
                <label className="font-medium">To</label>
                <DatePickerOne date={product?.custom_attributes.find((att) => att.attribute_code=="special_to_date")?.value ?? ''}/>
              </div>
            </div>
          </div>
    
          <div className="p-5 border border-gray-300 rounded-lg bg-white">
            <h2 className="font-medium text-xl text-black">Category</h2>
            <div className="mb-2">
              <label className="font-medium">Product Category</label>
              <select className="w-full p-2 mt-1 rounded-lg border border-gray-300">
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books & Stationeries</option>
                <option>Art Supplies</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-medium">Product Tags</label>
              <select className="w-full p-2 mt-1 rounded-lg border border-gray-300" multiple>
                <option>Internet Of Things</option>
                <option>Art Supplies</option>
              </select>
            </div>
          </div>
    
          <div className="p-5 border border-gray-300 rounded-lg bg-white">
            <h2 className="font-medium text-xl text-black">Inventory</h2>
            <div className="mb-2">
              <label className="font-medium">SKU</label>
              <input type="text" className="w-full p-2 mt-1 rounded-lg border border-gray-300" value={product?.sku}/>
            </div>
            <div className="mb-2">
            <label className="font-medium">Barcode</label>
              <BarcodeComponent value={product?.custom_attributes.find((att) => att.attribute_code=="barcode")?.value ?? ''}/>
            </div>
            <div className='mb-2'>
            <label className="font-medium">Stock quantity</label>
                <input type="text" className={`w-full p-2 mt-1 rounded-lg border ${product?.stock.qty === 0 ? 'border border-red-500 p-2' : 'border-gray-300'}`} value={product?.stock.qty} />

              {product?.stock.qty === 0 && <span className="text-red-500">Out of stock</span>}

            </div>
            </div>
          </div>
      );
}

export default ProductDetails;
