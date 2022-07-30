if (typeof fetch === 'undefined') {
  import('isomorphic-fetch');
}

import { BorzoiInputOptions, BorzoiResponse } from './types';
import { logger } from './utils/logs';
import { makeOptions } from './options';
import { parseBody } from './parser';

export const borzoi = async (options: BorzoiInputOptions): Promise<BorzoiResponse> => {
  const opts = makeOptions(options);

  let response: Response;
  const { url, ...init } = opts;
  try {
    response = await fetch(url, init);
  } catch (e) {
    logger.error((e as any).toString() || 'Unknown error occured and Borzoi was unable to send a request');
    return {
      data: null,
      ok: false,
      refetch: () => borzoi(options),
      internalError: true,
    };
  }

  const body = await parseBody(response, options.ignoreResponseBody);

  return {
    data: body,
    ok: response.ok,
    statusCode: response.status,
    refetch: () => borzoi(options),
    info: {
      statusText: response.statusText,
      responseType: response.type,
      redirected: response.redirected,
      headers: response.headers,
      url: response.url,
    },
  };
};

export const borzoiConfig = (config: BorzoiGlobalConfig) => {
  global.borzoiConfig = config;
};
