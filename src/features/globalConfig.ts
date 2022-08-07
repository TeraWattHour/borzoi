import { BorzoiGlobalConfig } from '../types';
import { assureBorzoiGlobals } from '../utils/assureBorzoiGlobals';

const allowedBorzoiGlobalConfigKeys = ['baseUrl', 'credentials', 'bodyDecoder', 'headers'];

export const borzoiGlobalDefaults = ['credentials', 'bodyDecoder'];

export const borzoiConfig = (options: Partial<BorzoiGlobalConfig>) => {
  const keys = Object.keys(options) as [keyof BorzoiGlobalConfig];

  for (const key of keys) {
    if (!allowedBorzoiGlobalConfigKeys.includes(key)) {
      delete options[key];
    }
  }

  assureBorzoiGlobals();
  global.borzoi.options = options;
};

type PropType<T, V extends keyof T> = T[V];

export const getBorzoiGlobalValue = (key: keyof BorzoiGlobalConfig): PropType<BorzoiGlobalConfig, typeof key> | null => {
  return global?.borzoi?.options?.[key] || null;
};

export const getBorzoiGlobal = (): BorzoiGlobalConfig => {
  return global?.borzoi?.options || null;
};
