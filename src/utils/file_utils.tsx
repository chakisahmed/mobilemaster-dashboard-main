export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64String = reader.result?.toString().replace('data:', '').replace(/^.+,/, '');
            if (base64String) {
                resolve(base64String);
            } else {
                reject(new Error('Failed to convert image to base64'));
            }
        };
        reader.onerror = reject;
    });
};