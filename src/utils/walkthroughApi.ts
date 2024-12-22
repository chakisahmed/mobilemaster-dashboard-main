// call axios.get(/api/walkthrough) or axios.post(/api/walkthrough) to fetch or post data respectively.
//

import axios from 'axios';
export interface WalkthroughType {
    id: string;
    title: string;
    description: string;
    image: string;
    sort_order: string;
}
export async function getWalkthroughData(): Promise<WalkthroughType[]> {
    try {
        const response = await axios.get('/api/walkthrough');
        return response.data as WalkthroughType[];
    } catch (error:any) {
        throw new Error('Error fetching walkthrough data: ' + error.message);
    }
}
export async function postWalkthroughData(data: WalkthroughType): Promise<WalkthroughType> {
    try {
        const response = await axios.post('/api/walkthrough', data);
        return response.data as WalkthroughType;
    } catch (error:any) {
        console.error('Error posting walkthrough data:', error);
        throw new Error('Error posting walkthrough data: ' + error.message);
    }
}
//delete
export async function deleteWalkthroughData(id: string): Promise<boolean> {
    try {
        await axios.delete(`/api/walkthrough/${id}`);
        return true;
    } catch (error:any) {
        console.error('Error deleting walkthrough data:', error);
        return false;
    }
}