import { IS_DEV } from '../consts';

export const logger = {
  warn: (message: string) => {
    if (!IS_DEV()) return;
    console.warn(`🟧 [BORZOI WARN] (${new Date().getTime()}) ${message}`);
  },
  error: (message: string) => {
    if (!IS_DEV()) return;
    console.error(`🟥 [BORZOI ERROR] (${new Date().getTime()}) ${message}`);
  },
};
