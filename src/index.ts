import { BorzoiOptions, BorzoiRequestOptions, BorzoiResponse } from './types';
import { makeOptions, makeRequestInit, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/defaults';

const borzoi = async <OkData = any, ErrData = any>(
    url: string,
    opts?: BorzoiRequestOptions
): Promise<BorzoiResponse<OkData, ErrData>> => {
    let options: Partial<BorzoiOptions> = {};
    for (const [key, value] of Object.entries(opts || {})) {
        options[key] = value || undefined;
    }

    options = makeOptions(options);
    url = makeUrl(url, options?.query);

    let response: Response;
    let result: BorzoiResponse;
    try {
        const requestInterceptors = Array.isArray(borzoiInterceptors.request) ? borzoiInterceptors.request : [];
        for (const interceptor of requestInterceptors) {
            const [interceptedUrl, interceptedOptions] = await interceptor(url, options);
            url = interceptedUrl;
            options = interceptedOptions || {};
        }
    } catch (e) {
        return {
            ok: false,
            data: null,
            refetch: () => borzoi(url, opts),
            internalError: 'Failed in request interceptor. ' + String(e),
            url,
        };
    }

    try {
        response = await fetch(url, makeRequestInit(options));
        result = {
            ok: response.ok,
            data: null,
            statusCode: response.status,
            statusText: response.statusText,
            responseType: response.type,
            redirected: response.redirected,
            headers: response.headers,
            url: response.url,
            refetch: () => borzoi(url, opts),
            response,
        } as BorzoiResponse;
    } catch (e) {
        return {
            ok: false,
            data: null,
            refetch: () => borzoi(url, opts),
            internalError: String(e) || true,
            url,
        };
    }

    try {
        result.data = parseResponseData(response, options.bodyDecoder);
    } catch (e) {
        result.data = null;
    }

    try {
        const responseInterceptors = Array.isArray(borzoiInterceptors.response) ? borzoiInterceptors.response : [];
        for (const interceptor of responseInterceptors) {
            result = await interceptor(result);
        }
    } catch (e) {
        return {
            ok: false,
            data: null,
            refetch: () => borzoi(url, opts),
            internalError: 'Failed in response interceptor. ' + String(e),
            url,
        };
    }

    return result;
};

export { borzoiConfig, borzoiInterceptors } from './features/defaults';
export * from './types';
export default borzoi;
