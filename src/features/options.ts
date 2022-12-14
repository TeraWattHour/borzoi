import { borzoiConfig, mergeWithGlobalConfig } from './defaults';
import { BorzoiOptions, BorzoiRequestOptions, HeadersType, HttpMethod, UrlQuery } from '../types';
import { isValidUrl } from '../helpers';

export const makeOptions = (options?: BorzoiRequestOptions): BorzoiOptions => {
    let headers = makeHeaders(options?.headers || undefined);

    options = mergeWithGlobalConfig(options);

    if (options.body && !headers.get('Content-Type')) {
        const { body, type } = makeBody(options!.body);
        options.body = body;
        type && headers.set('Content-Type', type);
    }

    let nonNullableOptions: BorzoiOptions = {};

    for (const option in options) {
        nonNullableOptions[option] = options[option] || undefined;
    }

    return {
        ...nonNullableOptions,
        method: (options.method || 'GET').toUpperCase() as HttpMethod,
        credentials: options.credentials || 'omit',
        headers,
    };
};

const makeBody = (body: any) => {
    if (body instanceof FormData || body instanceof URLSearchParams || typeof body === 'string') {
        return { body };
    }
    try {
        return {
            body: JSON.stringify(body),
            type: 'application/json',
        };
    } catch (error) {
        throw error;
    }
};

export const makeHeaders = (headers: HeadersType = {}): Headers => {
    let merged = { ...(borzoiConfig.headers || {}), ...headers };

    const h = new Headers();
    for (const [key, value] of Object.entries(merged)) {
        if (typeof value === 'number') {
            h.set(key, value.toString());
        }
        if (typeof value === 'string') {
            h.set(key, value);
        }
    }

    return h;
};

export const makeUrl = (url: string, query?: UrlQuery | null): string => {
    if (!isValidUrl(url)) {
        url = (borzoiConfig.baseUrl || '') + url;
    }

    if (query && query instanceof URLSearchParams) {
        url += `?${query.toString()}`;
    } else if (query) {
        const x = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (typeof value === 'number') {
                x.set(key, value.toString());
            }
            if (typeof value === 'string') {
                x.set(key, value);
            }
        }
        url += `?${x.toString()}`;
    }

    return url;
};
