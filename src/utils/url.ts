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
  if (isValidUrl(url)) {
    url = url;
  } else {
    let joinedUrl = (global.borzoi?.options?.baseUrl || '') + url;
    const t = new RegExp('^(?:[a-z+]+:)?//', 'i');

    if (!t.test(joinedUrl)) {
      throw new Error('URL is not absolute');
    }

    url = joinedUrl;
  }

  if (query) {
    const x = new URLSearchParams(query);
    url += `?${x.toString()}`;
  }

  return url;
};
