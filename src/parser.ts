import { BorzoiDecoder } from './types';
import { logger } from './utils/logs';

export const parseBody = async (
    response: Response,
    ignore: boolean = false,
    decoder: BorzoiDecoder = 'json'
): Promise<any | null> => {
    const fail = (ignore: boolean) => {
        if (!ignore) {
            logger.warn("Borzoi couldn't parse response's body. If this is the desired behaviour, add 'ignoreResponseBody' flag");
        }

        return null;
    };

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
    } catch (e) {
        return fail(ignore);
    }
};
