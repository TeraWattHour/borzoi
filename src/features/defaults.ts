import { BorzoiDefaultConfig, BorzoiInterceptors, BorzoiOptions, BorzoiHeaders } from '../types';
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

export const mergeOptions = (options: Partial<BorzoiOptions> = {}): Partial<BorzoiOptions> => {
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

export const mergeHeaders = (headers: BorzoiHeaders = {}): BorzoiHeaders => {
    const global = borzoiConfig.headers || {};
    const merged: BorzoiHeaders = {};

    for (const [key, value] of Object.entries(global)) {
        if (value == null || typeof value === 'undefined') {
            continue;
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            continue;
        }

        merged[key] = value;
    }

    for (let [key, value] of Object.entries(headers)) {
        if (typeof value === 'undefined') {
            continue;
        }

        if (value == null) {
            delete merged[key];
            continue;
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            continue;
        }

        merged[key] = value;
    }

    return merged;
};
