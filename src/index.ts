import { BorzoiRequestOptions, BorzoiResponse } from './types';
import { makeOptions, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/defaults';

const borzoi = async <T = any>(url: string, options?: BorzoiRequestOptions): Promise<BorzoiResponse<T>> => {
    let result: BorzoiResponse;

    try {
        for (const interceptor of borzoiInterceptors.request) {
            [url, options] = await interceptor(url, options);
        }

        url = makeUrl(url, options?.query);

        const fetchOptions = makeOptions(options);

        const response = await fetch(url, fetchOptions);

        const responseData = await parseResponseData(response, fetchOptions.bodyDecoder);

        result = {
            data: responseData,
            ok: response.ok,
            statusCode: response.status,
            statusText: response.statusText,
            responseType: response.type,
            redirected: response.redirected,
            headers: response.headers,
            url: response.url,
            refetch: () => borzoi(url, options),
            response,
        } as BorzoiResponse;
    } catch (e) {
        result = {
            data: null,
            ok: false,
            refetch: () => borzoi(url, options),
            internalError: String(e) || true,
            url,
        };
    }

    for (const interceptor of borzoiInterceptors.response) {
        result = await interceptor(result);
    }

    return result;
};

export { borzoiConfig, borzoiInterceptors } from './features/defaults';
export * from './types';
export default borzoi;
