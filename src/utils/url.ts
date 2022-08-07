import { UrlQuery } from '../types';

export const isValidUrl = (url: string) => {
  try {
    new URL(url);

    return true;
  } catch (e) {
    return false;
  }
};

export const makeUrl = (url: string, query?: UrlQuery): string => {
  if (!isValidUrl(url)) {
    let joinedUrl = (global.borzoi?.options?.baseUrl || '') + url;
    const t = new RegExp('^(?:[a-z+]+:)?//', 'i');

    if (!t.test(joinedUrl)) {
      throw new Error('URL is not absolute');
    }

    url = joinedUrl;
  }

  if (query) {
    if (query instanceof URLSearchParams) {
      url += `?${query.toString()}`;
    } else {
      const entries = Object.entries(query);
      const x = new URLSearchParams();
      for (const [k, v] of entries) {
        const t = typeof v;
        if (t === 'string') {
          x.set(k, v as string);
        }
        if (t === 'number') {
          x.set(k, (v as number).toString());
        }
      }
      url += `?${x.toString()}`;
    }
  }

  return url;
};
