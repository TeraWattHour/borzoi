export type BorzoiInputOptions = {
    query: UrlQuery;
    headers: HeadersType;
} & BorzoiBaseOptions;

export type BorzoiOptions = {
    headers: Headers;
} & BorzoiBaseOptions;

type BorzoiBaseOptions = {
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

export type BorzoiResponse = {
    ok: boolean;
    data: any;
    refetch: () => Promise<BorzoiResponse>;
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
    options?: Partial<BorzoiInputOptions>
) => [string, Partial<BorzoiInputOptions> | undefined] | Promise<[string, Partial<BorzoiInputOptions> | undefined]>;

export type ResponseInterceptor = (response: BorzoiResponse) => BorzoiResponse | Promise<BorzoiResponse>;

export type BorzoiDefaultConfig = {
    baseUrl: string;
    credentials: RequestCredentials;
    bodyDecoder: BorzoiDecoder;
    headers: HeadersType;
};

export type BorzoiInterceptors = {
    response: ResponseInterceptor[];
    request: RequestInterceptor[];
};
