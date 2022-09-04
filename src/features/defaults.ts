import { BorzoiDefaultConfig, BorzoiInputOptions, BorzoiInterceptors } from '../types';

export const borzoiConfig: Partial<BorzoiDefaultConfig> = {
    bodyDecoder: 'json',
    credentials: 'omit',
};

export const borzoiInterceptors: BorzoiInterceptors = {
    response: [],
    request: [],
};

const inheritableDefaultConfigKeys = ['credentials', 'bodyDecoder'] as const;
const allowedDefaultConfigKeys = ['baseUrl', 'credentials', 'bodyDecoder', 'headers'] as const;

export const mergeConfig = (options?: Partial<BorzoiInputOptions>): Partial<BorzoiInputOptions> => {
    options = options ? options : {};
    for (const [k, value] of Object.entries(borzoiConfig)) {
        const key = k as typeof allowedDefaultConfigKeys[number];

        if (!allowedDefaultConfigKeys.includes(key) || !inheritableDefaultConfigKeys.includes(key as any)) {
            continue;
        }

        if ((options as any)[key]) {
            continue;
        }
        (options as any)[key] = value;
    }
    return options;
};
