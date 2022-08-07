import { BorzoiInputOptions, BorzoiOptions, HeadersType } from './types';
import { applyDefaults } from './utils/applyDefaults';
import { mergeHeadersWithDefaults } from './utils/mergeHeaders';

export const makeOptions = (options?: Partial<BorzoiInputOptions>): Partial<BorzoiOptions> => {
  let headers = makeHeaders(options?.headers);

  let body = options?.body;
  if (body) {
    if (!headers.get('Content-Type')) {
      const { body: b, type } = makeBody(options!.body);
      body = b;
      if (type) {
        headers.set('Content-Type', type);
      }
    }
  }

  options = applyDefaults(options);

  return {
    ...options,
    method: options.method || 'get',
    credentials: options.credentials || 'omit',
    body,
    headers,
  };
};

const makeHeaders = (headers?: HeadersType): Headers => {
  const merged = mergeHeadersWithDefaults(headers);

  const x = new Headers();

  for (const [key, value] of Object.entries(merged)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    x.set(key, JSON.stringify(value));
  }

  return x;
};

const makeBody = (
  body: any
): {
  body: any;
  type?: string;
} => {
  if (!body)
    return {
      body: null,
    };

  if (typeof body === 'object') {
    return {
      body: JSON.stringify(body),
      type: 'application/json',
    };
  }
  if (body instanceof URLSearchParams) {
    return {
      body,
      type: 'x-www-form-urlencoded',
    };
  }
  if (body instanceof FormData) {
    return {
      body,
      type: 'form/multipart',
    };
  }

  return { body };
};
