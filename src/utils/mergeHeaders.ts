import { getBorzoiGlobalValue } from '../features/globalConfig';

export const mergeHeadersWithDefaults = (headers?: Map<string, string>): Map<string, string> => {
  const global = getBorzoiGlobalValue('headers') as Map<string, string> | null;

  return new Map([...(global || []), ...(headers || [])]);
};
