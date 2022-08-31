import { RequestInterceptor, ResponseInterceptor } from '../types';
import { assureBorzoiGlobals } from '../utils/assureBorzoiGlobals';

export const addBorzoiResponseInterceptor = (interceptor: ResponseInterceptor) => {
    assureBorzoiGlobals();
    global.borzoi.responseInterceptors!.push(interceptor);
};

export const addBorzoiRequestInterceptor = (interceptor: RequestInterceptor) => {
    assureBorzoiGlobals();
    global.borzoi.requestInterceptors!.push(interceptor);
};
