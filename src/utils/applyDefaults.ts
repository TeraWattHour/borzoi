import { borzoiGlobalDefaults, getBorzoiGlobal } from '../features/globalConfig';
import { BorzoiInputOptions } from '../types';

export const applyDefaults = (options?: Partial<BorzoiInputOptions>): Partial<BorzoiInputOptions> => {
  const globals = getBorzoiGlobal();
  const globalsArray = Object.entries(globals);

  if (!options) {
    options = {};
  }

  for (const entry of globalsArray) {
    const key = entry[0];
    if (!borzoiGlobalDefaults.includes(key)) {
      continue;
    }
    const x = (options as any)?.[key];
    if (x) {
      continue;
    }

    (options as any)[key] = entry[1];
  }

  return options;
};
