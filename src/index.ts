if (typeof fetch === 'undefined') {
  import('isomorphic-fetch');
}

import { BorzoiInputOptions, BorzoiResponse, RequestInterceptor, ResponseInterceptor } from './types';
import { logger } from './utils/logs';
import { makeOptions } from './options';
import { parseBody } from './parser';
import { makeUrl } from './utils/url';

export const borzoi = async (url: string, options?: Partial<BorzoiInputOptions>): Promise<BorzoiResponse> => {
  const reqIntercs = global.borzoi.requestInterceptors as RequestInterceptor[];
  let urlx = url;
  let ox = options;
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
    logger.error((e as any).toString() || 'Unknown error occured and Borzoi was unable to send a request');
    return {
      data: null,
      ok: false,
      refetch: () => borzoi(url, options),
      internalError: true,
      info: {
        url,
      },
    };
  }

  const body = await parseBody(response, opts.ignoreResponseBody);

  let result = {
    data: body,
    ok: response.ok,
    statusCode: response.status,
    refetch: () => borzoi(url, options),
    info: {
      statusText: response.statusText,
      responseType: response.type,
      redirected: response.redirected,
      headers: response.headers,
      url: response.url,
    },
  } as BorzoiResponse;

  const resIntercs = global.borzoi.responseInterceptors as ResponseInterceptor[];
  if (Array.isArray(resIntercs) && resIntercs.length > 0) {
    for (const interceptor of resIntercs) {
      result = await interceptor(result);
    }
  }

  return result;
};

export { borzoiConfig } from './features/globalConfig';
export { addBorzoiRequestInterceptor, addBorzoiResponseInterceptor } from './features/interceptors';
