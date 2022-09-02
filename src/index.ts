import { BorzoiInputOptions, BorzoiResponse } from './types';
import { makeOptions, makeUrl } from './features/options';
import { parseResponseData } from './features/parser';
import { borzoiInterceptors } from './features/globalConfig';

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

    let urlx = url;
    let ox = options;
    const reqIntercs = borzoiInterceptors.request;
    if (Array.isArray(reqIntercs) && reqIntercs.length > 0) {
        for (const interceptor of reqIntercs) {
            const [urly, oy] = await interceptor(urlx, ox);
            ox = oy;
            urlx = urly;
        }
    }

    const opts = makeOptions(ox);

    let response: Response;
    url = makeUrl(url, options?.query);

    try {
        response = await fetch(url, opts);
    } catch (e) {
        return internal(e);
    }

    let responseData = {};
    try {
        responseData = await parseResponseData(response, opts.ignoreResponseBody, opts.bodyDecoder);
    } catch (e) {
        return internal(e);
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
    } as BorzoiResponse;

    const resIntercs = borzoiInterceptors.response;
    if (Array.isArray(resIntercs) && resIntercs.length > 0) {
        for (const interceptor of resIntercs) {
            result = await interceptor(result);
        }
    }

    return result;
};

export { borzoiConfig, borzoiInterceptors } from './features/globalConfig';
export * from './types';
export default borzoi;
