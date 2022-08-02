import { getBorzoiGlobalValue } from '../features/globalConfig';
import { HeadersType } from '../types';

export const mergeHeadersWithDefaults = (headers?: HeadersType): HeadersType => {
  let global = getBorzoiGlobalValue('headers') as HeadersType | null;

  if (!global) {
    global = {};
  }

  if (!headers) {
    return global || {};
  }

  for (const headerName of Object.keys(headers)) {
    global[headerName] = headers[headerName];
  }

  return global;
};
