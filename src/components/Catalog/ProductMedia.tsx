import React from "react";

interface ProductMediaProps {
    images: string[];
}

const ProductMedia: React.FC<ProductMediaProps> = ({images}) => {
    return (
        <div className="p-5 border border-gray-300 rounded-lg">
            <h2>Product Media</h2>
            <p>Photo Product</p>
            <div className="flex gap-2.5 p-2.5 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mb-3.5 bg-gray-100">
                {images.map((image, index) => (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex justify-center items-center">
                    <img
                        src={"https://ext.web.wamia.tn/media/catalog/product"+image} // Example image source
                        alt="Product Image 1"
                        className="w-full h-full object-cover"
                    />
                </div>))}
            </div>
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-md border-none cursor-pointer">
                Add More Image
            </button>
        </div>
    );
};

export default ProductMedia;
