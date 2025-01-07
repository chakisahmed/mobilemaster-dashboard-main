import axios from 'axios';
export interface TagsType {
    id: string;
    name: string;
    image: string | undefined;
    category_id: string;
}
export async function getTagsData(): Promise<TagsType[]> {
    try {
        const response = await axios.get('/api/tag');
        console.log('response:', response.data);
        return response.data as TagsType[];
    } catch (error:any) {
        throw new Error('Error fetching tags data: ' + error.message);
    }
}
export async function postTagsData(data: Omit<TagsType, 'id'>): Promise<TagsType> {
    try {
        const response = await axios.post('/api/tag', data);
        console.log('response:', response.data);
        return response.data[0] as TagsType;
    } catch (error:any) {
        console.error('Error posting tag data:', error);
        throw new Error('Error posting tag data: ' + error.message);
    }
}
//delete
export async function deleteTagsData(id: string): Promise<boolean> {
    try {
        await axios.delete(`/api/tag/${id}`);
        return true;
    } catch (error:any) {
        console.error('Error deleting tag data:', error);
        return false;
    }
}