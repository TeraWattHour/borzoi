import { BorzoiInputOptions, BorzoiResponse } from './types';
import { makeOptions, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/defaults';

const borzoi = async (url: string, options?: Partial<BorzoiInputOptions>): Promise<BorzoiResponse> => {
    const internal = (e: unknown) => {
        return {
            data: null,
            ok: false,
            refetch: () => borzoi(url, options),
            internalError: String(e) || true,
            url,
        };
    };

    const reqIntercs = borzoiInterceptors.request;
    if (Array.isArray(reqIntercs) && reqIntercs.length > 0) {
        for (const interceptor of reqIntercs) {
            const [interceptedUrl, interceptedOptions] = await interceptor(url, options);
            url = interceptedUrl;
            options = interceptedOptions;
        }
    }

    const opts = makeOptions(options);
    url = makeUrl(url, options?.query);

    let response: Response;
    try {
        response = await fetch(url, opts);
    } catch (e) {
        return internal(e);
    }

    let responseData = null;
    try {
        responseData = await parseResponseData(response, opts.bodyDecoder);
    } catch (e) {
        responseData = null;
    }

    let result = {
        data: responseData,
        ok: response.ok,
        statusCode: response.status,
        refetch: () => borzoi(url, options),
        statusText: response.statusText,
        responseType: response.type,
        redirected: response.redirected,
        headers: response.headers,
        url: response.url,
        response,
    } as BorzoiResponse;

    const resIntercs = borzoiInterceptors.response;
    if (Array.isArray(resIntercs) && resIntercs.length > 0) {
        for (const interceptor of resIntercs) {
            result = await interceptor(result);
        }
    }

    return result;
};

export { borzoiConfig, borzoiInterceptors } from './features/defaults';
export * from './types';
export default borzoi;
