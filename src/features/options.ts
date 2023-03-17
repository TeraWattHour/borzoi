import { borzoiConfig, mergeConfig } from './defaults';
import { BorzoiInputOptions, BorzoiOptions, HeadersType, HttpMethod, UrlQuery } from '../types';
import { isValidUrl } from '../helpers';

export const makeOptions = (options?: Partial<BorzoiInputOptions>): Partial<BorzoiOptions> => {
    let headers = makeHeaders(options?.headers);

    options = mergeConfig(options);

    if (options.body && !headers.get('Content-Type')) {
        const { body, type } = makeBody(options.body);
        options.body = body;
        type && headers.set('Content-Type', type);
    }

    // expect all method verbs to be in uppercase, fallback to `GET`
    if (!options.method) {
        options.method = 'GET';
    }
    options.method = options.method.toUpperCase() as HttpMethod;

    if (!options.credentials) {
        options.credentials = 'omit';
    }

    return {
        ...options,
        headers,
    };
};

// tries to parse JSON body and sets according header
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
        return { body };
    }
};

// merges default headers with provided ones,
export const makeHeaders = (headers: HeadersType = {}): Headers => {
    const merged = borzoiConfig.headers || {};

    const httpHeaders = new Headers();
    for (let [key, value] of Object.entries(merged)) {
        if (typeof headers[key] !== 'undefined') {
            value = headers[key];
        }

        if (typeof value === 'undefined' || value == null || (typeof value !== 'string' && typeof value !== 'number')) {
            continue;
        }

        // only strings and numbers get to this point
        httpHeaders.set(key, String(value));
    }

    return httpHeaders;
};

// if provided url is unvalid, prepends baseUrl from global config, appends stringified query
export const makeUrl = (url: string, query?: UrlQuery): string => {
    if (!isValidUrl(url)) {
        url = (borzoiConfig.baseUrl || '') + url;
    }

    if (!query) {
        return url;
    }

    if (query instanceof URLSearchParams) {
        return url + `?${query.toString()}`;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
            value.forEach((v: string | number) => {
                params.append(key, String(v));
            });
        } else if (typeof value !== 'undefined' && value != null) {
            params.append(key, String(value));
        }
    }

    return url + `?${params.toString()}`;
};
