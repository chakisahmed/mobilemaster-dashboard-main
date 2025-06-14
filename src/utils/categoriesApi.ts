import axios from 'axios';
export interface Category {
  url: string | undefined;
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  category_id?: number;
  product_count: number;
  children_data: Category[];
  image?: string;
}
/**
 * 
 * {/* 
      category details
      {
  id: 2,
  parent_id: 1,
  name: 'Default Category',
  is_active: true,
  include_in_menu: true,
  custom_attributes: [
    { attribute_code: 'custom_use_parent_settings', value: '0' },
    { attribute_code: 'custom_apply_to_products', value: '0' },
    { attribute_code: 'url_key', value: 'default-category' },
    { attribute_code: 'breadcrumbs_priority', value: '0' },
    { attribute_code: 'use_in_crosslinking', value: '1' },
    { attribute_code: 'redirect_priority', value: '0' },
    {
      attribute_code: 'description',
      value: ''},
    {
      attribute_code: 'image',
      value: '/media/catalog/category/Robot_P_trin_1700.443.jpg'
    },

  ]
} 
 */
export interface CategoryDeatils{
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  include_in_menu: boolean;
  custom_attributes: {
    attribute_code: string;
    value: string;
  }[];

}
//oprional category id param
export async function categories(): Promise<Category | undefined> {
  try {
    const response = await axios.get('/api/categories');
    
    
    return response.data as Category;
  } catch (error:any) {
    console.error('Error fetching data:', error.response?.data || error.message);
  }
}
export async function categoryById(categoryId:number) : Promise<any>{
  try {
    const response = await axios.get(`/api/categories/${categoryId}`);
    return response.data; 
  } catch (error:any) {
    console.log('Error fetching data:', error.response?.data || error.message)
  }
}
export async function categoriesByName(name:string) : Promise<any>{
  try {
    const response = await axios.get(`/api/categories/list?name=${name}`);
    return response.data; 
  } catch (error:any) {
    console.log('Error fetching data:', error.response?.data || error.message)
  }
}
