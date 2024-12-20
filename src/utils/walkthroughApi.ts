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
    } catch (error) {
        console.error('Error fetching walkthrough data:', error);
        return {
            error: 'Failed to fetch walkthrough data',
            details: error.message
        };
    }
}
export async function postWalkthroughData(data: WalkthroughType): Promise<WalkthroughType> {
    try {
        const response = await axios.post('/api/walkthrough', data);
        return response.data as WalkthroughType;
    } catch (error) {
        console.error('Error posting walkthrough data:', error);
        return {
            error: 'Failed to post walkthrough data',
            details: error.message
        };
    }
}
//delete
export async function deleteWalkthroughData(id: string): Promise<boolean> {
    try {
        await axios.delete(`/api/walkthrough/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting walkthrough data:', error);
        return false;
    }
}