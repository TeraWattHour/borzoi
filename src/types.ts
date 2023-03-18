export type BorzoiRequestOptions = PartialAndNullable<BorzoiOptions>;

export type BorzoiOptions = {
    query: UrlQuery;
    headers: BorzoiHeaders;
    bodyDecoder: BorzoiDecoder;

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
    [key: string]: any;
};

export type UrlQuery =
    | URLSearchParams
    | {
          [key: string]: string | number | string[] | number[] | undefined | null;
      };

export type HttpMethod =
    | 'get'
    | 'post'
    | 'delete'
    | 'patch'
    | 'put'
    | 'options'
    | 'trace'
    | 'connect'
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PATCH'
    | 'PUT'
    | 'OPTIONS'
    | 'TRACE'
    | 'CONNECT';

export type BorzoiResponse<OkData = any, ErrData = any> = (
    | {
          ok: true;
          data: OkData;
      }
    | {
          ok: false;
          data: ErrData | null;
      }
) & {
    refetch: () => Promise<BorzoiResponse<OkData, ErrData>>;
    internalError: string | boolean;
} & Partial<GenericResponseInfo>;

export type GenericResponseInfo = {
    statusCode: number;
    url: string;
    headers: Headers;
    statusText: string;
    redirected: boolean;
    response: Response;
    responseType: ResponseType;
};

export type BorzoiDecoder = 'json' | 'form-data' | 'blob' | 'text' | 'array-buffer';

export type BorzoiHeaders = {
    [key: string]: string | number | undefined | null;
};

export type BorzoiDefaultConfig = {
    baseUrl: string;
    credentials: RequestCredentials;
    bodyDecoder: BorzoiDecoder;
    headers: BorzoiHeaders;
    cache: RequestCache;
    referrerPolicy: ReferrerPolicy;
    [key: string]: any;
};

export type BorzoiInterceptors = {
    response: BorzoiResponseInterceptor[];
    request: BorzoiRequestInterceptor[];
};

export type BorzoiRequestInterceptor = (
    url: string,
    options?: Partial<BorzoiOptions>
) => [string, Partial<BorzoiOptions | undefined>] | Promise<[string, Partial<BorzoiOptions | undefined>]>;

export type BorzoiResponseInterceptor = (response: BorzoiResponse) => BorzoiResponse | Promise<BorzoiResponse>;

export type PartialAndNullable<T> = {
    [K in keyof T]?: T[K] | null | undefined;
};
