type BorzoiGlobalConfig = {
  baseUrl?: string;
  credentials?: RequestCredentials;
  bodyDecoder?: BorzoiDecoder;
  includeDuration?: boolean;
};

declare var borzoiConfig: BorzoiGlobalConfig;

type BorzoiDecoder = 'json' | 'form-data' | 'blob' | 'text' | 'array-buffer';
