import axios from 'axios';
export type Product = {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight: number;
  extension_attributes: {
      website_ids: number[];
      category_links: { position: number; category_id: string }[];
      configurable_product_options?: {
          id: number;
          attribute_id: string;
          label: string;
          position: number;
          values: { value_index: number }[];
          product_id: number;
      }[];
      configurable_product_links?: number[];
  };
  product_links: {
      sku: string;
      link_type: string;
      linked_product_sku: string;
      linked_product_type: string;
      position: number;
  }[];
  options: any[];
  media_gallery_entries: {
      id: number;
      media_type: string;
      label: string;
      position: number;
      disabled: boolean;
      types: string[];
      file: string;
  }[];
  tier_prices: any[];
  custom_attributes: {
      attribute_code: string;
      value: string | string[];
  }[];
  stock: {
    is_in_stock: boolean;
    max_sale_qty: number;
    qty: number;
  };
};
export async function products(searchTerm: string | undefined, currentPage: number | undefined): Promise<{ items: Product[], total_count: number }> {
  try {
    const response = await axios.get('/api/products', {
      params: {
        searchTerm,
        currentPage
      }
    });
    console.log('Protected data:', response.data);
    return { items: response.data.items as Product[], total_count: response.data.total_count };
  } catch (error) {
    console.error('Error fetching data:', error.response?.data || error.message);
    return { items: [], total_count: 0 };
  }
}
export async function productBySku(sku: string): Promise<Product> {
  try {
    const response = await axios.get(`/api/products/${sku}`);
    console.log(`Protected data (product with sku ${sku}):`, response.data);
    return response.data as Product;
  } catch (error) {
    console.error('Error fetching data:', error.response?.data || error.message);
    return {} as Product;
  }
}
