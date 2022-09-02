import { BorzoiGlobalConfig, BorzoiInputOptions, RequestInterceptor, ResponseInterceptor } from '../types';

export let borzoiConfig: Partial<BorzoiGlobalConfig> = {};

export let borzoiInterceptors = {
    response: [],
    request: [],
} as {
    response: ResponseInterceptor[];
    request: RequestInterceptor[];
};

const inheritableGlobalConfigKeys = ['credentials', 'bodyDecoder'];
const allowedBorzoiGlobalConfigKeys = ['baseUrl', 'credentials', 'bodyDecoder', 'headers'] as const;

export const makeConfig = (options?: Partial<BorzoiInputOptions>): Partial<BorzoiInputOptions> => {
    let x = borzoiConfig;

    if (!options) {
        return x;
    }

    for (const entry of Object.entries(x)) {
        const y = entry[0] as typeof allowedBorzoiGlobalConfigKeys[number];
        if (!allowedBorzoiGlobalConfigKeys.includes(y) || !inheritableGlobalConfigKeys.includes(y)) {
            continue;
        }
        if (!(options as any)[y]) {
            continue;
        }
        (options as any)[y] = x[y];
    }
    return options;
};
