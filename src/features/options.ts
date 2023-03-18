import { borzoiConfig, mergeOptions, mergeHeaders } from './defaults';
import { BorzoiOptions, BorzoiHeaders, HttpMethod, UrlQuery } from '../types';
import { isValidUrl } from '../helpers';

export const makeRequestInit = (borzoiOptions: Partial<BorzoiOptions> = {}): RequestInit => {
    return {
        ...borzoiOptions,
        headers: makeHttpHeaders(borzoiOptions.headers),
    };
};

export const makeOptions = (options: Partial<BorzoiOptions> = {}): Partial<BorzoiOptions> => {
    options.headers = mergeHeaders(options.headers);
    options = mergeOptions(options);

    if (options.body && !options.headers!['Content-Type']) {
        const { body, type } = makeBody(options.body);
        options.body = body;
        if (type) {
            options.headers!['Content-Type'] = type;
        }
    }

    // expect all method verbs to be in uppercase, fallback to `GET`
    if (!options.method) {
        options.method = 'GET';
    }
    options.method = options.method.toUpperCase() as HttpMethod;

    if (!options.credentials) {
        options.credentials = 'omit';
    }

    return options;
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
export const makeHttpHeaders = (headers: BorzoiHeaders = {}): Headers => {
    const httpHeaders = new Headers();
    for (let [key, value] of Object.entries(headers)) {
        if (typeof value === 'undefined' || value == null) {
            continue;
        }

        // only strings and numbers get to this point so String constructor is fine
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
