export type BorzoiInputOptions = {
    query: UrlQuery;
    headers: HeadersType;
} & BorzoiBaseOptions;

export type BorzoiOptions = {
    headers: Headers;
} & BorzoiBaseOptions;

type BorzoiBaseOptions = {
    bodyDecoder: BorzoiDecoder;

    // standard fetch
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
} & {
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

export type HeadersType = {
    [key: string]: string | number | undefined | null;
};

export type RequestInterceptor = (
    url: string,
    options?: Partial<BorzoiInputOptions>
) => Promise<[string, Partial<BorzoiInputOptions> | undefined]>;

export type ResponseInterceptor = (response: BorzoiResponse) => BorzoiResponse | Promise<BorzoiResponse>;

export type BorzoiDefaultConfig = {
    baseUrl: string;
    credentials: RequestCredentials;
    bodyDecoder: BorzoiDecoder;
    headers: HeadersType;
    cache: RequestCache;
    referrerPolicy: ReferrerPolicy;
} & {
    [key: string]: any;
};

export type BorzoiInterceptors = {
    response: ResponseInterceptor[];
    request: RequestInterceptor[];
};
