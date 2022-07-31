import { RequestInterceptor, ResponseInterceptor } from '../types';
import { assureBorzoiGlobals } from '../utils/assureBorzoiGlobals';

export const addResponseInterceptor = (interceptor: ResponseInterceptor) => {
  assureBorzoiGlobals();
  global.borzoi.responseInterceptors!.push(interceptor);
};

export const addRequestInterceptor = (interceptor: RequestInterceptor) => {
  assureBorzoiGlobals();
  global.borzoi.requestInterceptors!.push(interceptor);
};
