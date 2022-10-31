import { BorzoiInputOptions, BorzoiResponse } from './types';
import { makeOptions, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/defaults';

const borzoi = async <T = any>(url: string, options?: Partial<BorzoiInputOptions>): Promise<BorzoiResponse<T>> => {
    try {
        const requestInterceptors = Array.isArray(borzoiInterceptors.request) ? borzoiInterceptors.request : [];
        for (const interceptor of requestInterceptors) {
            [url, options] = await interceptor(url, options);
        }

        const opts = makeOptions(options);
        url = makeUrl(url, options?.query);

        const response = await fetch(url, opts);

        const responseData = await parseResponseData(response, opts.bodyDecoder);

        let result = {
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

        const responseInterceptors = Array.isArray(borzoiInterceptors.response) ? borzoiInterceptors.response : [];
        for (const interceptor of responseInterceptors) {
            result = await interceptor(result);
        }

        return result;
    } catch (e) {
        return {
            data: null,
            ok: false,
            refetch: () => borzoi(url, options),
            internalError: String(e) || true,
            url,
        };
    }
};

export { borzoiConfig, borzoiInterceptors } from './features/defaults';
export * from './types';
export default borzoi;
