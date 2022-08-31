import { IS_DEV } from '../consts';

export const logger = {
    timeString: () => new Date().toTimeString().slice(0, 8),
    warn: (message: string) => {
        if (!IS_DEV()) return;
        console.log(`🟧 [BORZOI WARN] (${logger.timeString()}) ${message}`);
    },
    error: (message: string) => {
        if (!IS_DEV()) return;
        console.log(`🟥 [BORZOI ERROR] (${logger.timeString()}) ${message}`);
    },
};
