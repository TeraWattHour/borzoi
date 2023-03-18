import { BorzoiOptions, BorzoiRequestOptions, BorzoiResponse } from './types';
import { makeOptions, makeRequestInit, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/defaults';

const borzoi = async <OkData = any, ErrData = any>(
    url: string,
    opts?: BorzoiRequestOptions
): Promise<BorzoiResponse<OkData, ErrData>> => {
    try {
        let options: Partial<BorzoiOptions> = {};
        for (const [key, value] of Object.entries(opts || {})) {
            options[key] = value || undefined;
        }

        options = makeOptions(options);
        url = makeUrl(url, options?.query);

        const requestInterceptors = Array.isArray(borzoiInterceptors.request) ? borzoiInterceptors.request : [];
        for (const interceptor of requestInterceptors) {
            const [interceptedUrl, interceptedOptions] = await interceptor(url, options);
            url = interceptedUrl;
            options = interceptedOptions || {};
        }

        const response = await fetch(url, makeRequestInit(options));

        const responseData = await parseResponseData(response, options.bodyDecoder);

        let result = {
            data: responseData,
            ok: response.ok,
            statusCode: response.status,
            statusText: response.statusText,
            responseType: response.type,
            redirected: response.redirected,
            headers: response.headers,
            url: response.url,
            refetch: () => borzoi(url, opts),
            response,
            internalError: false,
        } as BorzoiResponse;

        const responseInterceptors = Array.isArray(borzoiInterceptors.response) ? borzoiInterceptors.response : [];
        for (const interceptor of responseInterceptors) {
            result = await interceptor(result);
        }

        return result;
    } catch (e) {
        return {
            ok: false,
            data: null,
            refetch: () => borzoi(url, opts),
            internalError: String(e) || true,
            url,
        };
    }
};

export { borzoiConfig, borzoiInterceptors } from './features/defaults';
export * from './types';
export default borzoi;
