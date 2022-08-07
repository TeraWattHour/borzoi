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
    const t = typeof value;
    if (value === null || value === undefined || (t !== 'string' && t !== 'number')) continue;

    if (t === 'number') {
      x.set(key, (value as number).toString());
    }
    if (t === 'string') {
      x.set(key, value as string);
    }
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
