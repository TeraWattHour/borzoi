import { BorzoiDecoder } from '../types';

export const parseResponseData = async (response: Response, decoder?: BorzoiDecoder): Promise<any | null> => {
    const contentType = response.headers.get('Content-Type');
    if (!contentType) {
        return null;
    }

    if (!decoder) {
        if (contentType.startsWith('application/json')) {
            decoder = 'json';
        } else if (contentType.startsWith('text')) {
            decoder = 'text';
        } else if (contentType.startsWith('multipart/form-data')) {
            decoder = 'form-data';
        } else if (contentType.startsWith('application/')) {
            decoder = 'blob';
        } else {
            decoder = 'array-buffer';
        }
    }

    try {
        switch (decoder) {
            case 'json':
                return await response.json();
            case 'array-buffer':
                return await response.arrayBuffer();
            case 'blob':
                return await response.blob();
            case 'form-data':
                return await response.formData();
            case 'text':
                return await response.text();
            default:
                return await response.json();
        }
    } catch (error) {
        return null;
    }
};
