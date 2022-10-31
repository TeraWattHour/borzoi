import { BorzoiDefaultConfig, BorzoiInputOptions, BorzoiInterceptors } from '../types';
import { isObject } from '../helpers';

export const borzoiConfig: Partial<BorzoiDefaultConfig> = {
    bodyDecoder: 'json',
    credentials: 'omit',
};

export const borzoiInterceptors: BorzoiInterceptors = {
    response: [],
    request: [],
};

const allowedDefaultConfigKeys = ['baseUrl', 'cache', 'next', 'credentials', 'bodyDecoder', 'headers', 'referrerPolicy'];

export const mergeConfig = (options: Partial<BorzoiInputOptions> = {}): Partial<BorzoiInputOptions> => {
    for (const [key, value] of Object.entries(borzoiConfig)) {
        if (!allowedDefaultConfigKeys.includes(key)) {
            continue;
        }
        if (options[key]) {
            if (isObject(options[key]) && isObject(borzoiConfig[key])) {
                options[key] = { ...borzoiConfig[key], ...options[key] };
            }
            continue;
        }
        options[key] = value;
    }

    return options;
};
