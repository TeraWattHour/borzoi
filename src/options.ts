import { BorzoiInputOptions, BorzoiOptions } from './types';
import { isValidUrl } from './utils/url';

export const makeOptions = (options: BorzoiInputOptions): BorzoiOptions => {
  let headers = makeHeaders(options.headers);
  let url = makeUrl(options);

  let body = options.body;
  if (!headers.get('Content-Type')) {
    const { body: b, type } = makeBody(options.body);
    body = b;
    if (type) {
      headers.set('Content-Type', type);
    }
  }

  const defaults = globalThis.borzoiConfig;
  if (defaults) {
    const keys = (Object.keys(defaults) as unknown) as [keyof BorzoiInputOptions];

    for (const key of keys) {
      if (typeof options[key] === 'undefined' || !options[key]) {
        options[key] = (defaults as any)[key];
      }
    }
  }

  return {
    ...options,
    method: options.method || 'get',
    credentials: options.credentials || 'omit',
    url,
    body,
    headers,
  };
};

const makeUrl = (options: BorzoiInputOptions): string => {
  let url = '';
  if (isValidUrl(options.url)) {
    url = options.url;
  } else {
    let joinedUrl = (global.borzoiConfig?.baseUrl || '') + options.url;
    const t = new RegExp('^(?:[a-z+]+:)?//', 'i');

    if (!t.test(joinedUrl)) {
      throw new Error('URL is not absolute');
    }

    url = joinedUrl;
  }

  if (options.query) {
    const x = new URLSearchParams(options.query);
    url += `?${x.toString()}`;
  }

  return url;
};

const makeHeaders = (headers: Map<string, string> | undefined): Headers => {
  const x = new Headers();
  if (!headers) return x;

  headers.forEach((v, k) => {
    x.append(k, v);
  });

  return x;
};

const makeBody = (
  options: BorzoiInputOptions
): {
  body: any;
  type?: string;
} => {
  const body = options?.body;

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
