export type BorzoiInputOptions = {
  url: string;
  body?: any;
  query?: URLSearchParams;
  method?: HttpMethod | HttpMethodValue;
  credentials?: RequestCredentials;
  headers?: Map<string, string>;
  ignoreResponseBody?: boolean;
  bodyDecoder?: BorzoiDecoder;
  redirect?: RequestRedirect;
  keepalive?: boolean;
  cache?: RequestCache;
  integrity?: string;
  mode?: RequestMode;
  referrer?: string;
  signal?: AbortSignal;
  window?: null;
};

export type BorzoiOptions = {
  url: string;
  body: any;
  method?: HttpMethod | HttpMethodValue;
  credentials?: RequestCredentials;
  headers?: Headers;
  ignoreResponseBody?: boolean;
  bodyDecoder?: BorzoiDecoder;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
  keepalive?: boolean;
  mode?: RequestMode;
  integrity?: string;
  cache?: RequestCache;
  referrer?: string;
  signal?: AbortSignal;
  window?: null;
};

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PATCH = 'patch',
  PUT = 'put',
  OPTIONS = 'options',
  TRACE = 'trace',
  CONNECT = 'connect',
}

export type HttpMethodValue = 'get' | 'post' | 'delete' | 'patch' | 'put' | 'options' | 'trace' | 'connect';

export type BorzoiResponse = BorzoiResponseCompleted | BorzoiResponseInternalError;

export type BorzoiResponseInternalError = {
  data: null;
  refetch: () => Promise<BorzoiResponse>;
  internalError: true;
  ok: false;
};

export type BorzoiResponseCompleted = {
  ok: boolean;
  data: any;
  refetch: () => Promise<BorzoiResponse>;
  statusCode: number;
  info: {
    url: string;
    headers: Headers;
    statusText: string;
    redirected: boolean;
    responseType: ResponseType;
  };
};
