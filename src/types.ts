type NullableObject<T> = {
    [N in keyof T]?: T[N] | null;
};

export type BorzoiRequestOptions = NullableObject<
    {
        query: UrlQuery;
        headers: HeadersType;
    } & BorzoiBaseOptions
>;

export type BorzoiOptions = Partial<
    {
        headers: Headers;
    } & BorzoiBaseOptions
>;

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
          [key: string]: string | undefined | null | number;
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

export type BorzoiResponse<T = any> = {
    ok: boolean;
    data: T | null;
    refetch: () => Promise<BorzoiResponse<T>>;
    internalError: string | boolean;
} & Partial<BorzoiResponseInfo>;

export type BorzoiResponseInfo = {
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
    [key: string]: string | null | undefined | number;
};

export type RequestInterceptor = (
    url: string,
    options?: BorzoiRequestOptions
) => Promise<[string, BorzoiRequestOptions | undefined]>;

export type ResponseInterceptor = (response: BorzoiResponse) => Promise<BorzoiResponse>;

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
