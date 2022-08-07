export type BorzoiInputOptions = {
  query: UrlQuery;
  headers: HeadersType;
} & BorzoiBaseOptions;

export type BorzoiOptions = {
  headers: Headers;
} & BorzoiBaseOptions;

type BorzoiBaseOptions = {
  ignoreResponseBody: boolean;
  bodyDecoder: BorzoiDecoder;

  // fetch
  body: any;
  method: HttpMethod;
  credentials: RequestCredentials;
  referrerPolicy: ReferrerPolicy;
  redirect: RequestRedirect;
  keepalive: boolean;
  mode: RequestMode;
  integrity: string;
  cache: RequestCache;
  referrer: string;
  signal: AbortSignal;
  window: null;
};

export type UrlQuery =
  | URLSearchParams
  | {
      [key: string]: string | undefined | null | number;
    };

export type HttpMethod = 'get' | 'post' | 'delete' | 'patch' | 'put' | 'options' | 'trace' | 'connect';

export type BorzoiResponse = BorzoiResponseCompleted | BorzoiResponseInternalError;

export type BorzoiResponseInternalError = {
  data: null;
  refetch: () => Promise<BorzoiResponse>;
  internalError: true;
  ok: false;
  info: {
    url: string;
  };
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

export type BorzoiDecoder = 'json' | 'form-data' | 'blob' | 'text' | 'array-buffer';

export type HeadersType = {
  [key: string]: string | null | undefined | number;
};

export type RequestInterceptor = (
  url: string,
  options?: Partial<BorzoiInputOptions>
) => [string, Partial<BorzoiInputOptions> | undefined] | Promise<[string, Partial<BorzoiInputOptions> | undefined]>;

export type ResponseInterceptor = (response: BorzoiResponse) => BorzoiResponse | Promise<BorzoiResponse>;

export type BorzoiGlobalConfig = {
  baseUrl: string;
  credentials: RequestCredentials;
  bodyDecoder: BorzoiDecoder;
  headers: HeadersType;
};
